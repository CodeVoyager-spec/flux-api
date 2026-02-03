import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { uniqueConstraintMap } from "../utils/db-error-map";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Handle Postgres unique constraint errors (code 23505)
  if ((err as any).code === "23505") {
    const constraint = (err as any).constraint;
    const message = constraint && constraint in uniqueConstraintMap
        ? uniqueConstraintMap[constraint as keyof typeof uniqueConstraintMap]
        : "Duplicate value";

    return res.status(409).json({ success: false, message });
  }

  // Handle custom application errors
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Unknown / unexpected errors
  console.error("ERROR:", err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
};
