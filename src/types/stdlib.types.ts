import { z } from "zod";

/**
 * Zod schema for Aiken Standard Library module structure
 */

// Schema for a single module entry
export const StdlibModuleSchema = z.object({
  // Optional description of the module
  d: z.string().optional(),
  // Optional array of type definitions
  t: z.array(z.string()).optional(),
  // Optional array of function signatures
  f: z.array(z.string()).optional(),
});

// Schema for the entire stdlib object
export const StdlibSchema = z.record(z.string(), StdlibModuleSchema);

// TypeScript types inferred from Zod schemas
export type StdlibModule = z.infer<typeof StdlibModuleSchema>;
export type Stdlib = z.infer<typeof StdlibSchema>;
