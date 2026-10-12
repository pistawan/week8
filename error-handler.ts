
import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  const status =
    err instanceof ZodError
      ? ((err as ZodError & { httpStatus?: number }).httpStatus ?? 422)
      : 500;

  res.status(status).json({
    error: status === 500 ? "Internal Server Error" : "Validation Error",
    message: err instanceof Error ? err.message : "เกิดข้อผิดพลาด",
  });
};
