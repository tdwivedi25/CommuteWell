import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import chat models
export * from "./models/chat";

// === TABLE DEFINITIONS ===

// Users (keeping from template for auth if needed, though Lite rules say use Replit Auth if auth needed. User didn't ask for auth explicitly, but route saving implies it. I'll stick to a simple single-user view or just use the template's user table if I were doing auth. For MVP without explicit auth request, I might just store data without user_id or use a default user.)
// Actually, the user asked for "Route Setup Screen", implying personalization.
// I'll define the tables but maybe just use a hardcoded user_id=1 for the MVP if auth isn't set up.
// Or I can just omit user_id for now if it's a single device app. "Mobile app" implies personal.
// I'll include user_id but make it nullable or optional for now to keep it simple.

export const commuteRoutes = pgTable("commute_routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Lathrop -> Bay Area"
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureStart: text("departure_start").notNull(), // "17:30"
  departureEnd: text("departure_end").notNull(),   // "19:30"
  transportModes: text("transport_modes").array().notNull(), // ["drive", "bart"]
  commuteHours: integer("commute_hours").default(0), // hours part of one-way commute time
  commuteMinutes: integer("commute_minutes").default(0), // minutes part of one-way commute time
  daysPerWeek: integer("days_per_week").default(5), // days per week commuting
  isActive: boolean("is_active").default(true),
});

export const trafficStats = pgTable("traffic_stats", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  congestionLevel: integer("congestion_level").notNull(), // 0-100
  status: text("status").notNull(), // "green", "yellow", "red"
  recommendation: text("recommendation").notNull(),
  explanation: text("explanation"), // AI generated
});

// === RELATIONS ===
// (Skipping complex relations for MVP)

// === BASE SCHEMAS ===
export const insertCommuteRouteSchema = createInsertSchema(commuteRoutes).omit({ id: true });
export const insertTrafficStatSchema = createInsertSchema(trafficStats).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type CommuteRoute = typeof commuteRoutes.$inferSelect;
export type InsertCommuteRoute = z.infer<typeof insertCommuteRouteSchema>;

export type TrafficStat = typeof trafficStats.$inferSelect;
export type InsertTrafficStat = z.infer<typeof insertTrafficStatSchema>;

export type CreateRouteRequest = InsertCommuteRoute;
export type UpdateRouteRequest = Partial<InsertCommuteRoute>;

export type RouteResponse = CommuteRoute;
export type TrafficPredictionResponse = {
  currentStatus: TrafficStat;
  forecast: { time: string; congestion: number }[]; // Mock forecast data
  bestDepartureTime: string;
};
