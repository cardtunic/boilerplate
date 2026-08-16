import type { DatabaseError } from "$api/database/errors/databaseError";

export function isUniqueViolation(cols: string[], error: DatabaseError) {
  return (
    error.message === "unique_violation" &&
    cols.some((col) => error.cause.constraint?.includes(col))
  );
}
