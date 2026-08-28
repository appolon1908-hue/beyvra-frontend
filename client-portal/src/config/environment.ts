/**
 * Environment Variable Validation
 * 
 * This module ensures all required environment variables are present
 * at application startup, preventing hard-to-debug production issues.
 */

export type EnvironmentSchema = {
  VITE_API_BASE_URL?: string;
  VITE_SOCKET_BASE_URL?: string;
  VITE_TENANT_ID?: string;
};

const REQUIRED_VARS: (keyof EnvironmentSchema)[] = [
  // Add required env vars here
  // "VITE_TENANT_ID",
];

const OPTIONAL_VARS: (keyof EnvironmentSchema)[] = [
  "VITE_API_BASE_URL",
  "VITE_SOCKET_BASE_URL",
];

/**
 * Validates that all required environment variables are configured.
 * Should be called during application initialization.
 * 
 * @throws Error if required environment variable is missing
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_VARS) {
    const value = import.meta.env[varName] || (window as any)?.configs?.[varName];
    if (!value) {
      missing.push(varName);
    }
  }

  // Check optional variables for development warnings
  if (import.meta.env.DEV) {
    for (const varName of OPTIONAL_VARS) {
      const value = import.meta.env[varName] || (window as any)?.configs?.[varName];
      if (!value) {
        warnings.push(`Optional: ${varName} is not configured`);
      }
    }
  }

  // Log warnings in development
  if (warnings.length > 0 && import.meta.env.DEV) {
    console.warn("⚠️ Environment configuration warnings:", warnings);
  }

  // Fail on missing required variables
  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(", ")}`;
    console.error("❌", errorMsg);
    throw new Error(errorMsg);
  }

  console.log("✓ Environment validation passed");
}

export default validateEnvironment;
