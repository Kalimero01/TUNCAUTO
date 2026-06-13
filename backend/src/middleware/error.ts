import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" && err instanceof Error ? err.message : undefined,
  });
};
