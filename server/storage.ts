import { type User, type InsertUser, type KevinInquiry, type InsertKevinInquiry } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createKevinInquiry(inquiry: InsertKevinInquiry): Promise<KevinInquiry>;
  getKevinInquiries(): Promise<KevinInquiry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private kevinInquiries: Map<string, KevinInquiry>;

  constructor() {
    this.users = new Map();
    this.kevinInquiries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createKevinInquiry(insertInquiry: InsertKevinInquiry): Promise<KevinInquiry> {
    const id = randomUUID();
    const inquiry: KevinInquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date()
    };
    this.kevinInquiries.set(id, inquiry);
    return inquiry;
  }

  async getKevinInquiries(): Promise<KevinInquiry[]> {
    return Array.from(this.kevinInquiries.values());
  }
}

export const storage = new MemStorage();
