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
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKevinInquiry = z.infer<typeof insertKevinInquirySchema>;
export type KevinInquiry = typeof kevinInquiries.$inferSelect;
