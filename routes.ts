import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { worlds } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // Get world data
  app.get("/api/worlds/:id", async (req, res) => {
    const world = await db.query.worlds.findFirst({
      where: eq(worlds.id, parseInt(req.params.id))
    });
    if (!world) {
      res.status(404).json({ message: "World not found" });
      return;
    }
    res.json(world);
  });

  // Save world data
  app.post("/api/worlds/:id", async (req, res) => {
    const { blocks } = req.body;
    await db
      .update(worlds)
      .set({ 
        blocks,
        lastSaved: Date.now()
      })
      .where(eq(worlds.id, parseInt(req.params.id)));
    res.json({ success: true });
  });

  return server;
}
