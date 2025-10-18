import { z } from "zod";
import { stdlib } from "@/utils/docs/stdlib";

/**
 * Extract all valid stdlib module names as a union type
 */
export type StdlibModuleName = keyof typeof stdlib;

/**
 * Array of all valid stdlib module names for runtime validation
 */
export const STDLIB_MODULE_NAMES = Object.keys(stdlib) as [string, ...string[]];

/**
 * Input schema for stdlib-module tool
 * Accepts a single module name from the stdlib
 */
export const StdlibModuleInputSchema = z.object({
  module: z.enum(STDLIB_MODULE_NAMES, {
    errorMap: () => ({
      message: `Module must be one of the valid stdlib modules. Use the 'stdlib' tool to see all available modules.`,
    }),
  }),
});

/**
 * Output schema for stdlib-module tool
 * Returns the implementation source code for the requested module
 */
export const StdlibModuleOutputSchema = z.object({
  module: z.string().describe("The module name that was fetched"),
  sourceCode: z.string().describe("The complete source code implementation"),
});

// TypeScript types inferred from schemas
export type StdlibModuleInput = z.infer<typeof StdlibModuleInputSchema>;
export type StdlibModuleOutput = z.infer<typeof StdlibModuleOutputSchema>;

