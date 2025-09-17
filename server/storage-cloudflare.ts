/**
 * Cloudflare KV/D1 Storage Implementation for KEVINSTAMP
 * 
 * Replaces in-memory storage with persistent Cloudflare infrastructure
 * Cultural Context: Preserving KEVIN's digital heritage with enterprise-grade storage
 */

import { type User, type InsertUser, type KevinInquiry, type InsertKevinInquiry } from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

/**
 * Cloudflare KV client interface
 */
interface CloudflareKVBinding {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: {
    ttl?: number;
    metadata?: Record<string, any>;
  }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
    keys: Array<{ name: string; metadata?: any; expiration?: number }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

/**
 * Cloudflare D1 client interface
 */
interface CloudflareD1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = Record<string, any>> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    size_after: number;
    rows_read: number;
    rows_written: number;
  };
}

/**
 * Cloudflare-based storage implementation
 */
export class CloudflareStorage implements IStorage {
  private kv: CloudflareKVBinding;
  private db: CloudflareD1Database;
  
  // Cache configuration
  private readonly CACHE_TTL = {
    users: 3600,           // 1 hour
    recentInquiries: 300,  // 5 minutes
    inquiryCount: 1800,    // 30 minutes
    sessions: 86400 * 7    // 7 days
  };

  constructor(kv: CloudflareKVBinding, db: CloudflareD1Database) {
    this.kv = kv;
    this.db = db;
  }

  /**
   * Initialize database schema (run once during deployment)
   */
  async initializeSchema(): Promise<void> {
    const schema = `
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
        priority INTEGER DEFAULT 0
      );

      -- Indexes for performance optimization
      CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_created_at ON kevin_inquiries(created_at);
      CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_budget_range ON kevin_inquiries(budget_range);
      CREATE INDEX IF NOT EXISTS idx_kevin_inquiries_processed ON kevin_inquiries(processed);

      -- Users table for authentication
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- User index
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `;

    await this.db.exec(schema);
    console.log('✅ Cloudflare D1 schema initialized');
  }

  /**
   * Get user by ID with KV caching
   */
  async getUser(id: string): Promise<User | undefined> {
    // Try cache first
    const cacheKey = `user:${id}`;
    const cached = await this.kv.get(cacheKey, { type: 'json' });
    
    if (cached) {
      console.log(`🚀 User cache hit: ${id}`);
      return cached as User;
    }

    // Query D1 database
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const result = await stmt.bind(id).first<User>();

    if (result) {
      // Cache the result
      await this.kv.put(cacheKey, JSON.stringify(result), { 
        ttl: this.CACHE_TTL.users 
      });
      
      console.log(`💾 User loaded from D1 and cached: ${id}`);
      return result;
    }

    return undefined;
  }

  /**
   * Get user by username with KV caching
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    // Try cache first
    const cacheKey = `user:username:${username}`;
    const cached = await this.kv.get(cacheKey, { type: 'json' });
    
    if (cached) {
      console.log(`🚀 User cache hit by username: ${username}`);
      return cached as User;
    }

    // Query D1 database
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    const result = await stmt.bind(username).first<User>();

    if (result) {
      // Cache by both ID and username
      const userCacheValue = JSON.stringify(result);
      await Promise.all([
        this.kv.put(`user:${result.id}`, userCacheValue, { ttl: this.CACHE_TTL.users }),
        this.kv.put(`user:username:${username}`, userCacheValue, { ttl: this.CACHE_TTL.users })
      ]);
      
      console.log(`💾 User loaded from D1 and cached: ${username}`);
      return result;
    }

    return undefined;
  }

  /**
   * Create new user with cache invalidation
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };

    // Insert into D1 database
    const stmt = this.db.prepare(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)'
    );
    
    const result = await stmt.bind(user.id, user.username, user.password).run();

    if (!result.success) {
      throw new Error(`Failed to create user: ${result.error}`);
    }

    // Cache the new user
    const userCacheValue = JSON.stringify(user);
    await Promise.all([
      this.kv.put(`user:${user.id}`, userCacheValue, { ttl: this.CACHE_TTL.users }),
      this.kv.put(`user:username:${user.username}`, userCacheValue, { ttl: this.CACHE_TTL.users })
    ]);

    console.log(`✅ Created and cached user: ${user.username} (${user.id})`);
    return user;
  }

  /**
   * Create KEVIN inquiry with D1 persistence and KV caching
   */
  async createKevinInquiry(insertInquiry: InsertKevinInquiry): Promise<KevinInquiry> {
    const id = randomUUID();
    const inquiry: KevinInquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date()
    };

    // Calculate priority based on budget range
    const priority = this.calculateInquiryPriority(inquiry.budgetRange);

    // Insert into D1 database
    const stmt = this.db.prepare(`
      INSERT INTO kevin_inquiries (id, name, email, motivation, budget_range, created_at, priority) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(
      inquiry.id,
      inquiry.name, 
      inquiry.email,
      inquiry.motivation,
      inquiry.budgetRange,
      inquiry.createdAt.toISOString(),
      priority
    ).run();

    if (!result.success) {
      throw new Error(`Failed to create KEVIN inquiry: ${result.error}`);
    }

    // Cache the inquiry for quick access
    await this.kv.put(`inquiry:${inquiry.id}`, JSON.stringify(inquiry), {
      ttl: this.CACHE_TTL.recentInquiries
    });

    // Update cached statistics
    await this.updateInquiryCache();

    console.log(`✅ KEVIN inquiry created and cached: ${inquiry.name} (${inquiry.budgetRange} BTC)`);
    console.log(`🎯 Cultural preservation: KEVIN inquiry ${inquiry.id} secured in Cloudflare infrastructure`);
    
    return inquiry;
  }

  /**
   * Get all KEVIN inquiries with smart caching
   */
  async getKevinInquiries(limit: number = 100): Promise<KevinInquiry[]> {
    // Try cache for recent inquiries first
    const cacheKey = `inquiries:recent:${limit}`;
    const cached = await this.kv.get(cacheKey, { type: 'json' });
    
    if (cached) {
      console.log(`🚀 Recent inquiries cache hit (${limit} items)`);
      return cached as KevinInquiry[];
    }

    // Query D1 database
    const stmt = this.db.prepare(`
      SELECT * FROM kevin_inquiries 
      ORDER BY created_at DESC, priority DESC
      LIMIT ?
    `);
    
    const result = await stmt.bind(limit).all<KevinInquiry>();

    if (result.success && result.results) {
      const inquiries = result.results.map(row => ({
        ...row,
        createdAt: new Date(row.createdAt)
      }));

      // Cache the results
      await this.kv.put(cacheKey, JSON.stringify(inquiries), {
        ttl: this.CACHE_TTL.recentInquiries
      });

      console.log(`💾 Loaded ${inquiries.length} KEVIN inquiries from D1 and cached`);
      return inquiries;
    }

    return [];
  }

  /**
   * Get high-priority KEVIN inquiries (for community attention)
   */
  async getHighPriorityInquiries(): Promise<KevinInquiry[]> {
    const cacheKey = 'inquiries:priority:high';
    const cached = await this.kv.get(cacheKey, { type: 'json' });
    
    if (cached) {
      console.log('🚀 High-priority inquiries cache hit');
      return cached as KevinInquiry[];
    }

    // Query D1 for high-value inquiries (10+ BTC)
    const stmt = this.db.prepare(`
      SELECT * FROM kevin_inquiries 
      WHERE budget_range = '10+' 
      AND processed = FALSE
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    const result = await stmt.all<KevinInquiry>();

    if (result.success && result.results) {
      const inquiries = result.results.map(row => ({
        ...row,
        createdAt: new Date(row.createdAt)
      }));

      // Cache high-priority inquiries with shorter TTL
      await this.kv.put(cacheKey, JSON.stringify(inquiries), {
        ttl: 60  // 1 minute for urgent inquiries
      });

      console.log(`💾 Loaded ${inquiries.length} high-priority KEVIN inquiries`);
      return inquiries;
    }

    return [];
  }

  /**
   * Mark inquiry as processed
   */
  async markInquiryProcessed(inquiryId: string): Promise<boolean> {
    const stmt = this.db.prepare(
      'UPDATE kevin_inquiries SET processed = TRUE WHERE id = ?'
    );
    
    const result = await stmt.bind(inquiryId).run();

    if (result.success) {
      // Invalidate related caches
      await this.invalidateInquiryCache();
      console.log(`✅ KEVIN inquiry marked as processed: ${inquiryId}`);
      return true;
    }

    return false;
  }

  /**
   * Get inquiry statistics for analytics
   */
  async getInquiryStats(): Promise<{
    total: number;
    unprocessed: number;
    highValue: number;
    thisMonth: number;
  }> {
    const cacheKey = 'stats:inquiries';
    const cached = await this.kv.get(cacheKey, { type: 'json' });
    
    if (cached) {
      console.log('🚀 Inquiry stats cache hit');
      return cached;
    }

    // Query D1 for statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN processed = FALSE THEN 1 ELSE 0 END) as unprocessed,
        SUM(CASE WHEN budget_range = '10+' THEN 1 ELSE 0 END) as highValue,
        SUM(CASE WHEN DATE(created_at) >= DATE('now', 'start of month') THEN 1 ELSE 0 END) as thisMonth
      FROM kevin_inquiries
    `;

    const result = await this.db.prepare(statsQuery).first();

    if (result) {
      const stats = {
        total: result.total || 0,
        unprocessed: result.unprocessed || 0,
        highValue: result.highValue || 0,
        thisMonth: result.thisMonth || 0
      };

      // Cache stats for 30 minutes
      await this.kv.put(cacheKey, JSON.stringify(stats), {
        ttl: this.CACHE_TTL.inquiryCount
      });

      console.log(`📊 KEVIN inquiry stats calculated and cached:`, stats);
      return stats;
    }

    return { total: 0, unprocessed: 0, highValue: 0, thisMonth: 0 };
  }

  /**
   * Session management using KV storage
   */
  async storeSession(sessionId: string, sessionData: any, ttl?: number): Promise<void> {
    const key = `session:${sessionId}`;
    const value = JSON.stringify({
      ...sessionData,
      lastAccess: new Date().toISOString()
    });

    await this.kv.put(key, value, { 
      ttl: ttl || this.CACHE_TTL.sessions 
    });

    console.log(`🔐 Session stored: ${sessionId}`);
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = `session:${sessionId}`;
    const cached = await this.kv.get(key, { type: 'json' });
    
    if (cached) {
      // Update last access time
      await this.storeSession(sessionId, cached);
      console.log(`🔐 Session retrieved: ${sessionId}`);
      return cached;
    }

    return null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.kv.delete(key);
    console.log(`🔐 Session deleted: ${sessionId}`);
  }

  /**
   * Private helper methods
   */

  private calculateInquiryPriority(budgetRange: string): number {
    const priorityMap: Record<string, number> = {
      '1-2': 1,
      '2-5': 2, 
      '5-10': 3,
      '10+': 4
    };
    
    return priorityMap[budgetRange] || 1;
  }

  private async updateInquiryCache(): Promise<void> {
    // Invalidate inquiry-related caches to force refresh
    const cacheKeys = [
      'inquiries:recent:50',
      'inquiries:recent:100',
      'inquiries:priority:high',
      'stats:inquiries'
    ];

    await Promise.all(
      cacheKeys.map(key => this.kv.delete(key))
    );
  }

  private async invalidateInquiryCache(): Promise<void> {
    await this.updateInquiryCache();
    console.log('🧹 Inquiry cache invalidated');
  }
}

/**
 * Factory function to create storage instance
 * This would be used in the main application
 */
export function createCloudflareStorage(
  kv: CloudflareKVBinding, 
  db: CloudflareD1Database
): CloudflareStorage {
  return new CloudflareStorage(kv, db);
}

/**
 * Storage adapter that automatically detects environment
 */
export function createStorageAdapter(): IStorage {
  // In Cloudflare Workers environment, these bindings would be available
  if (typeof KV !== 'undefined' && typeof DB !== 'undefined') {
    console.log('🌟 Using Cloudflare KV/D1 storage for KEVIN');
    const cloudflareStorage = new CloudflareStorage(KV as any, DB as any);
    
    // Initialize schema on first use
    cloudflareStorage.initializeSchema().catch(console.error);
    
    return cloudflareStorage;
  }

  // Fallback to memory storage for development
  console.log('⚠️ Falling back to memory storage (development mode)');
  const { MemStorage } = require('./storage');
  return new MemStorage();
}

export default createStorageAdapter;