import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const kevinInquiries = pgTable("kevin_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  motivation: text("motivation").notNull(),
  budgetRange: text("budget_range").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertKevinInquirySchema = createInsertSchema(kevinInquiries).pick({
  name: true,
  email: true,
  motivation: true,
  budgetRange: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Valid email is required"),
  motivation: z.string().min(10, "Please provide at least 10 characters explaining your interest"),
  budgetRange: z.enum(["1-2", "2-5", "5-10", "10+"], {
    errorMap: () => ({ message: "Please select a valid budget range" })
  }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKevinInquiry = z.infer<typeof insertKevinInquirySchema>;
export type KevinInquiry = typeof kevinInquiries.$inferSelect;

// Token data type for API responses
export interface TokenData {
  ticker: string;
  supply: number;
  protocol: string;
  status: string;
  marketCapBTC: number;
  change24h: number;
  vol24h: number;
  totalVolBTC: number;
  holders: number;
  superExPrice?: number;
  superExVolume?: number;
  superExUrl?: string;
  deploymentStamp: number;
  perMintLimit: number;
  fairLaunchMinted: number;
  tradeUrl: string;
  lastUpdated: string;
  dataSource: string;
}

// Community data type for API responses
export interface CommunityData {
  totalMemes: number;
  totalVideos: number;
  totalGifs: number;
  totalImages: number;
  totalViews: number;
  totalArtists: number;
  depotUrl: string;
  lastUpdated: string;
  dataSource: string;
  featured?: Array<{
    id: string;
    title: string;
    type: string;
    imageUrl: string;
    description: string;
    category: string;
  }>;
}
