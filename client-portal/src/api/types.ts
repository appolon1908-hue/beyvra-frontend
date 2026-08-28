/**
 * Shared API Types & Interfaces
 * Centralized type definitions for API responses and common patterns
 */

import type { UseMutationOptions } from "@tanstack/react-query";

/**
 * Standard API response wrapper for paginated results
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Authentication responses
 */
export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthResponse {
  user?: Record<string, unknown>;
  mfa_required?: boolean;
  login_token?: string;
}

export interface RegisterResponse extends AuthResponse {
  user?: Record<string, unknown>;
}

/**
 * User/Profile response
 */
export interface ProfileResponse {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

/**
 * Wallet response
 */
export interface WalletResponse extends PaginatedResponse<Record<string, unknown>> {}

/**
 * Bank details response
 */
export interface BankDetailsResponse {
  data: Array<{
    id: number;
    created_at: string;
    updated_at: string;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    last_name: string;
    routing_number: string;
    swift_code: string;
    iban: string;
    country: string;
  }>;
}

/**
 * Market data response
 */
export interface MarketDataResponse {
  [key: string]: unknown;
}

/**
 * Base mutation hook options with callbacks
 */
export interface BaseMutationHookOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
  onError?: (error: unknown, variables: TVariables, context: unknown) => void;
  [key: string]: unknown;
}

/**
 * Token refresh response
 */
export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    [key: string]: unknown;
  };
  code?: string;
  message?: string;
  [key: string]: unknown;
}

export default {};
