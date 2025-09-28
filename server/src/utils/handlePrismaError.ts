export function handlePrismaError(error: any, context: string): never {
  if (error.code === "P2002") {
    throw new Error(`${context}: Unique constraint failed.`);
  }
  if (error.code === "P2003") {
    throw new Error(`${context}: Invalid foreign key reference. Check related IDs.`);
  }
  if (error.code === "P2025") {
    throw new Error(`${context}: Record not found.`);
  }
  throw error;
}
