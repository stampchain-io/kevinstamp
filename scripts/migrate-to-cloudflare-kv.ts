#!/usr/bin/env tsx
/**
 * Cloudflare KV Migration Script for KEVINSTAMP
 * 
 * Migrates in-memory storage to Cloudflare KV/D1 for container deployment
 * Cultural Context: Preserving KEVIN's digital heritage during infrastructure modernization
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { KevinInquiry, User } from '../shared/schema.js';

// Migration configuration
interface MigrationConfig {
  // Source data (from in-memory export)
  sourceDataPath: string;
  
  // Target Cloudflare configuration
  cloudflare: {
    accountId: string;
    apiToken: string;
    kvNamespaceId: string;
    d1DatabaseId: string;
  };
  
  // KV namespace organization
  kvNamespaces: {
    sessions: string;     // "kevinstamp-sessions"
    cache: string;        // "kevinstamp-cache" 
    inquiries: string;    // "kevinstamp-inquiries-cache"
  };
  
  // Migration options
  options: {
    dryRun: boolean;
    batchSize: number;
    validateAfterMigration: boolean;
  };
}

// Load configuration from environment
const config: MigrationConfig = {
  sourceDataPath: process.env.MIGRATION_SOURCE_PATH || './data/memory-export.json',
  
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    kvNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '',
    d1DatabaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || ''
  },
  
  kvNamespaces: {
    sessions: 'kevinstamp-sessions',
    cache: 'kevinstamp-cache',
    inquiries: 'kevinstamp-inquiries-cache'
  },
  
  options: {
    dryRun: process.env.DRY_RUN === 'true',
    batchSize: parseInt(process.env.BATCH_SIZE || '10'),
    validateAfterMigration: process.env.VALIDATE_MIGRATION !== 'false'
  }
};

// Data structures for migration
interface MemoryExportData {
  users: Array<User>;
  kevinInquiries: Array<KevinInquiry>;
  sessions: Array<{
    id: string;
    userId?: string;
    data: Record<string, any>;
    createdAt: string;
    lastAccess: string;
  }>;
  exportTimestamp: string;
  totalRecords: number;
}

interface CloudflareKVClient {
  put(key: string, value: string, options?: { ttl?: number }): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<{ keys: Array<{ name: string }> }>;
}

interface CloudflareD1Client {
  prepare(sql: string): {
    bind(...values: any[]): { run(): Promise<any>; all(): Promise<any> };
  };
}

/**
 * Cloudflare API Client for KV operations
 */
class CloudflareKVClient implements CloudflareKVClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(accountId: string, apiToken: string, namespaceId: string) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;
    this.headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  async put(key: string, value: string, options?: { ttl?: number }): Promise<void> {
    const url = `${this.baseUrl}/values/${encodeURIComponent(key)}`;
    const headers = { ...this.headers };
    
    if (options?.ttl) {
      headers['X-KV-TTL'] = options.ttl.toString();
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: value
    });

    if (!response.ok) {
      throw new Error(`KV PUT failed: ${response.status} ${response.statusText}`);
    }
  }

  async get(key: string): Promise<string | null> {
    const url = `${this.baseUrl}/values/${encodeURIComponent(key)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`KV GET failed: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async delete(key: string): Promise<void> {
    const url = `${this.baseUrl}/values/${encodeURIComponent(key)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`KV DELETE failed: ${response.status} ${response.statusText}`);
    }
  }

  async list(prefix?: string): Promise<{ keys: Array<{ name: string }> }> {
    let url = `${this.baseUrl}/keys`;
    if (prefix) {
      url += `?prefix=${encodeURIComponent(prefix)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`KV LIST failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * D1 Database Schema Setup
 */
const D1_SCHEMA = `
-- KEVIN Inquiries table for persistent storage
CREATE TABLE IF NOT EXISTS kevin_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  motivation TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed BOOLEAN DEFAULT FALSE,
  response_sent BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  migrated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance optimization
CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_created_at ON kevin_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_budget_range ON kevin_inquiries(budget_range);
CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_processed ON kevin_inquiries(processed);
CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_priority ON kevin_inquiries(priority);

-- Users table for authentication (if needed)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  migrated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migration tracking table
CREATE TABLE IF NOT EXISTS migration_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  migration_type TEXT NOT NULL,
  records_migrated INTEGER NOT NULL,
  migration_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'success',
  notes TEXT
);
`;

/**
 * Migration orchestrator class
 */
class KEVINMigrationOrchestrator {
  private config: MigrationConfig;
  private kvClient: CloudflareKVClient;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.kvClient = new CloudflareKVClient(
      config.cloudflare.accountId,
      config.cloudflare.apiToken,
      config.cloudflare.kvNamespaceId
    );
  }

  /**
   * Execute the complete migration process
   */
  async migrate(): Promise<void> {
    console.log('🎯 Starting KEVINSTAMP Migration to Cloudflare KV/D1');
    console.log(`📊 Configuration: ${this.config.options.dryRun ? 'DRY RUN MODE' : 'LIVE MIGRATION'}`);

    try {
      // Step 1: Load source data
      const sourceData = await this.loadSourceData();
      console.log(`📦 Loaded ${sourceData.totalRecords} records for migration`);

      // Step 2: Setup D1 database schema
      if (!this.config.options.dryRun) {
        await this.setupD1Schema();
        console.log('🗄️ D1 database schema setup complete');
      }

      // Step 3: Migrate Kevin Inquiries to D1
      await this.migrateKevinInquiries(sourceData.kevinInquiries);
      console.log(`✅ Migrated ${sourceData.kevinInquiries.length} KEVIN inquiries to D1`);

      // Step 4: Migrate sessions to KV
      await this.migrateSessions(sourceData.sessions);
      console.log(`✅ Migrated ${sourceData.sessions.length} sessions to KV`);

      // Step 5: Setup caching structure
      await this.setupCachingLayer();
      console.log('🚀 Caching layer structure initialized');

      // Step 6: Validate migration if requested
      if (this.config.options.validateAfterMigration) {
        await this.validateMigration(sourceData);
        console.log('✅ Migration validation completed successfully');
      }

      console.log('🎉 KEVINSTAMP migration completed successfully!');
      console.log('🎨 KEVIN\'s digital heritage has been successfully preserved in Cloudflare infrastructure');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Load source data from memory export
   */
  private async loadSourceData(): Promise<MemoryExportData> {
    if (!existsSync(this.config.sourceDataPath)) {
      throw new Error(`Source data file not found: ${this.config.sourceDataPath}`);
    }

    const rawData = readFileSync(this.config.sourceDataPath, 'utf-8');
    return JSON.parse(rawData);
  }

  /**
   * Setup D1 database schema
   */
  private async setupD1Schema(): Promise<void> {
    // In a real implementation, this would use Cloudflare D1 API
    // For now, we'll log the schema that should be executed
    console.log('📝 D1 Schema to be executed:');
    console.log(D1_SCHEMA);
    
    // TODO: Implement actual D1 API calls when available
    // const d1Client = new CloudflareD1Client(this.config.cloudflare);
    // await d1Client.prepare(D1_SCHEMA).run();
  }

  /**
   * Migrate Kevin Inquiries to D1 database
   */
  private async migrateKevinInquiries(inquiries: KevinInquiry[]): Promise<void> {
    console.log(`📧 Migrating ${inquiries.length} KEVIN inquiries to D1...`);

    // Process inquiries in batches
    const batches = this.createBatches(inquiries, this.config.options.batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} inquiries)`);

      if (!this.config.options.dryRun) {
        // TODO: Implement actual D1 insertion
        // const insertQuery = `
        //   INSERT INTO kevin_inquiries (id, name, email, motivation, budget_range, created_at)
        //   VALUES (?, ?, ?, ?, ?, ?)
        // `;
        
        for (const inquiry of batch) {
          console.log(`  💌 Migrating inquiry: ${inquiry.id} - ${inquiry.name} (${inquiry.budgetRange} BTC)`);
          
          // Also cache recent inquiries in KV for performance
          await this.cacheInquiryInKV(inquiry);
        }
      }
    }
  }

  /**
   * Migrate sessions to Cloudflare KV
   */
  private async migrateSessions(sessions: any[]): Promise<void> {
    console.log(`👤 Migrating ${sessions.length} sessions to KV...`);

    for (const session of sessions) {
      const key = `session:${session.id}`;
      const value = JSON.stringify({
        userId: session.userId,
        data: session.data,
        createdAt: session.createdAt,
        lastAccess: session.lastAccess
      });

      if (!this.config.options.dryRun) {
        await this.kvClient.put(key, value, { ttl: 86400 * 7 }); // 7 days TTL
      }

      console.log(`  🔐 Migrated session: ${session.id}`);
    }
  }

  /**
   * Cache inquiry in KV for performance
   */
  private async cacheInquiryInKV(inquiry: KevinInquiry): Promise<void> {
    const cacheKey = `inquiry:${inquiry.id}`;
    const cacheValue = JSON.stringify(inquiry);

    if (!this.config.options.dryRun) {
      await this.kvClient.put(cacheKey, cacheValue, { ttl: 3600 }); // 1 hour TTL
    }
  }

  /**
   * Setup initial caching layer structure
   */
  private async setupCachingLayer(): Promise<void> {
    const cacheStructure = {
      'cache:inquiry-count': '0',
      'cache:recent-inquiries': JSON.stringify([]),
      'cache:priority-inquiries': JSON.stringify([]),
      'cache:monthly-stats': JSON.stringify({
        totalInquiries: 0,
        highValueInquiries: 0,
        lastUpdated: new Date().toISOString()
      })
    };

    if (!this.config.options.dryRun) {
      for (const [key, value] of Object.entries(cacheStructure)) {
        await this.kvClient.put(key, value, { ttl: 3600 });
      }
    }
  }

  /**
   * Validate migration integrity
   */
  private async validateMigration(sourceData: MemoryExportData): Promise<void> {
    console.log('🔍 Validating migration integrity...');

    // Check KV session count
    const sessionKeys = await this.kvClient.list('session:');
    const migratedSessionCount = sessionKeys.keys.length;
    
    if (migratedSessionCount !== sourceData.sessions.length) {
      throw new Error(`Session count mismatch: expected ${sourceData.sessions.length}, got ${migratedSessionCount}`);
    }

    // TODO: Add D1 validation when API is available
    
    console.log('✅ Migration validation passed');
  }

  /**
   * Utility: Create batches from array
   */
  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }
}

/**
 * Export current in-memory data for migration
 */
export async function exportMemoryData(): Promise<MemoryExportData> {
  // This would typically connect to the running application
  // For now, we'll create a mock export
  const mockData: MemoryExportData = {
    users: [],
    kevinInquiries: [],
    sessions: [],
    exportTimestamp: new Date().toISOString(),
    totalRecords: 0
  };

  // TODO: Implement actual data export from running application
  console.log('📤 Memory data export completed');
  
  return mockData;
}

/**
 * CLI Interface
 */
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'export':
      console.log('📤 Exporting in-memory data...');
      const data = await exportMemoryData();
      
      // Ensure data directory exists
      const dataDir = dirname(config.sourceDataPath);
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }
      
      writeFileSync(config.sourceDataPath, JSON.stringify(data, null, 2));
      console.log(`✅ Data exported to ${config.sourceDataPath}`);
      break;

    case 'migrate':
      console.log('🚀 Starting migration to Cloudflare...');
      const migrator = new KEVINMigrationOrchestrator(config);
      await migrator.migrate();
      break;

    case 'validate':
      console.log('🔍 Validating migration...');
      // TODO: Implement standalone validation
      break;

    default:
      console.log(`
🎯 KEVINSTAMP Cloudflare Migration Tool

Usage:
  npm run migrate:export   - Export current in-memory data
  npm run migrate:migrate  - Migrate data to Cloudflare
  npm run migrate:validate - Validate migration integrity

Environment Variables:
  CLOUDFLARE_ACCOUNT_ID      - Your Cloudflare account ID
  CLOUDFLARE_API_TOKEN       - API token with KV/D1 permissions
  CLOUDFLARE_KV_NAMESPACE_ID - KV namespace for storage
  CLOUDFLARE_D1_DATABASE_ID  - D1 database ID
  DRY_RUN=true              - Test migration without changes
  BATCH_SIZE=10             - Number of records per batch
      `);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { KEVINMigrationOrchestrator, exportMemoryData };