import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Routes Endpoints ===
  app.get(api.routes.list.path, async (req, res) => {
    const routes = await storage.getRoutes();
    res.json(routes);
  });

  app.post(api.routes.create.path, async (req, res) => {
    try {
      const input = api.routes.create.input.parse(req.body);
      const route = await storage.createRoute(input);
      res.status(201).json(route);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.routes.get.path, async (req, res) => {
    const route = await storage.getRoute(Number(req.params.id));
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  });

  app.put(api.routes.update.path, async (req, res) => {
    try {
      const input = api.routes.update.input.parse(req.body);
      const route = await storage.updateRoute(Number(req.params.id), input);
      res.json(route);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(404).json({ message: "Route not found" });
    }
  });

  // === Prediction Endpoint with AI ===
  app.get(api.predictions.get.path, async (req, res) => {
    const routeId = Number(req.params.id);
    const route = await storage.getRoute(routeId);
    
    if (!route) return res.status(404).json({ message: "Route not found" });

    // Mock forecast data
    const forecast = [
      { time: "17:00", congestion: 40 },
      { time: "17:30", congestion: 60 },
      { time: "18:00", congestion: 85 },
      { time: "18:30", congestion: 95 },
      { time: "19:00", congestion: 70 },
      { time: "19:30", congestion: 50 },
    ];

    // Simple logic for status
    const currentCongestion = 85; // Mock current
    let status = "green";
    if (currentCongestion > 80) status = "red";
    else if (currentCongestion > 50) status = "yellow";

    // AI Generation for explanation
    let explanation = "Traffic is heavy.";
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: "You are a traffic assistant. Give a very short, 1-sentence explanation for traffic congestion."
          },
          {
            role: "user",
            content: `Route: ${route.origin} to ${route.destination}. Current congestion is ${currentCongestion}/100. Peak is at 18:30. Explain why briefly.`
          }
        ],
        max_completion_tokens: 50,
      });
      explanation = response.choices[0].message.content || explanation;
    } catch (e) {
      console.error("OpenAI error:", e);
    }

    const currentStatus = {
      id: 0, // Mock ID
      routeId,
      timestamp: new Date(),
      congestionLevel: currentCongestion,
      status,
      recommendation: status === "red" ? "Wait to leave" : "Good time to leave",
      explanation
    };

    res.json({
      currentStatus,
      forecast,
      bestDepartureTime: "19:30"
    });
  });

  // === Device Sync Endpoint ===
  app.post(api.device.sync.path, async (req, res) => {
    // Mock device sync
    console.log("Device synced with status:", req.body.status);
    res.json({ success: true });
  });

  // === Seed Data ===
  const existingRoutes = await storage.getRoutes();
  if (existingRoutes.length === 0) {
    await storage.createRoute({
      name: "Daily Commute",
      origin: "Lathrop, CA",
      destination: "San Francisco, CA",
      departureStart: "17:00",
      departureEnd: "20:00",
      transportModes: ["drive", "bart"],
      isActive: true
    });
  }

  return httpServer;
}
