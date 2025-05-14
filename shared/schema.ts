import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category_id: integer("category_id").notNull(),
  image_url: text("image_url").notNull(),
  price: integer("price"),
  location: text("location").notNull(),
  distance: text("distance").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  instructor: text("instructor"),
  total_spots: integer("total_spots").notNull(),
  available_spots: integer("available_spots").notNull(),
  requirements: text("requirements"),
  what_you_learn: json("what_you_learn").$type<string[]>(),
});

export const insertWorkshopSchema = createInsertSchema(workshops).omit({
  id: true,
});

export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type Workshop = typeof workshops.$inferSelect;

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  workshop_id: integer("workshop_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).pick({
  user_id: true,
  workshop_id: true,
});

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  short_description: text("short_description").notNull(),
  long_description: text("long_description").notNull(),
  image_url: text("image_url").notNull(),
  price: integer("price"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
