import { db } from "./db";
import {
  commuteRoutes,
  trafficStats,
  type InsertCommuteRoute,
  type InsertTrafficStat,
  type CommuteRoute,
  type TrafficStat
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Routes
  getRoutes(): Promise<CommuteRoute[]>;
  getRoute(id: number): Promise<CommuteRoute | undefined>;
  createRoute(route: InsertCommuteRoute): Promise<CommuteRoute>;
  updateRoute(id: number, route: Partial<InsertCommuteRoute>): Promise<CommuteRoute>;
  
  // Stats
  getLatestTrafficStat(routeId: number): Promise<TrafficStat | undefined>;
  createTrafficStat(stat: InsertTrafficStat): Promise<TrafficStat>;
}

export class DatabaseStorage implements IStorage {
  async getRoutes(): Promise<CommuteRoute[]> {
    return await db.select().from(commuteRoutes);
  }

  async getRoute(id: number): Promise<CommuteRoute | undefined> {
    const [route] = await db.select().from(commuteRoutes).where(eq(commuteRoutes.id, id));
    return route;
  }

  async createRoute(route: InsertCommuteRoute): Promise<CommuteRoute> {
    const [newRoute] = await db.insert(commuteRoutes).values(route).returning();
    return newRoute;
  }

  async updateRoute(id: number, route: Partial<InsertCommuteRoute>): Promise<CommuteRoute> {
    const [updated] = await db.update(commuteRoutes)
      .set(route)
      .where(eq(commuteRoutes.id, id))
      .returning();
    return updated;
  }

  async getLatestTrafficStat(routeId: number): Promise<TrafficStat | undefined> {
    const [stat] = await db.select()
      .from(trafficStats)
      .where(eq(trafficStats.routeId, routeId))
      .orderBy(desc(trafficStats.timestamp))
      .limit(1);
    return stat;
  }

  async createTrafficStat(stat: InsertTrafficStat): Promise<TrafficStat> {
    const [newStat] = await db.insert(trafficStats).values(stat).returning();
    return newStat;
  }
}

export const storage = new DatabaseStorage();
