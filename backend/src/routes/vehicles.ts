import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createVehicleSchema, updateVehicleSchema } from "../schemas/vehicle.js";

export const vehiclesRouter = Router();

vehiclesRouter.get("/", async (_req, res, next) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: vehicles });
  } catch (error) {
    next(error);
  }
});

vehiclesRouter.get("/:id", async (req, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.json({ data: vehicle });
  } catch (error) {
    next(error);
  }
});

vehiclesRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }
    const vehicle = await prisma.vehicle.create({ data: parsed.data });
    res.status(201).json({ data: vehicle });
  } catch (error) {
    next(error);
  }
});

vehiclesRouter.patch("/:id", async (req, res, next) => {
  try {
    const parsed = updateVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: vehicle });
  } catch (error) {
    next(error);
  }
});

vehiclesRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
