import { authenticatedRequest, ApiError } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { PaginatedResponse } from "api/types";

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TRAILING_STOP";
export type TimeInForce = "DAY" | "GTC" | "IOC" | "FOK";

/** Canonical order lifecycle. UNKNOWN/RECONCILIATION_REQUIRED must be handled explicitly, never treated as terminal success or failure. */
export type OrderState =
  | "DRAFT"
  | "PREVIEWED"
  | "PENDING_SUBMIT"
  | "ACKNOWLEDGED"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "REJECTED"
  | "CANCEL_PENDING"
  | "CANCELED"
  | "EXPIRED"
  | "UNKNOWN"
  | "RECONCILIATION_REQUIRED";

export const TERMINAL_ORDER_STATES: readonly OrderState[] = [
  "FILLED",
  "REJECTED",
  "CANCELED",
  "EXPIRED",
];

export const isTerminalOrderState = (state: OrderState): boolean => TERMINAL_ORDER_STATES.includes(state);

export interface OrderRequest {
  account_id: string;
  instrument: string;
  side: OrderSide;
  order_type: OrderType;
  time_in_force: TimeInForce;
  quantity: string;
  limit_price?: string;
  stop_price?: string;
  quote_id?: string;
}

export interface OrderPreview {
  quote_id: string;
  quote_version: string;
  quote_expires_at: string;
  decision: "ALLOW" | "DENY" | "REVIEW";
  reason_codes: string[];
  estimated_price: string;
  estimated_notional: string;
  estimated_fee: string;
  buying_power_required: string;
  compliance_policy_version: string;
}

export interface Order extends OrderRequest {
  id: string;
  tenant_id: string;
  state: OrderState;
  filled_quantity: string;
  average_fill_price: string | null;
  version: number;
  compliance_policy_version: string | null;
  reason_codes: string[];
  created_at: string;
  updated_at: string;
}

export interface OrderEvent {
  event_id: string;
  order_id: string;
  sequence: number;
  type: string;
  from_state: OrderState | null;
  to_state: OrderState;
  reason_codes: string[];
  occurred_at: string;
}

export interface Execution {
  execution_id: string;
  order_id: string;
  account_id: string;
  instrument: string;
  side: OrderSide;
  quantity: string;
  price: string;
  fee: string;
  executed_at: string;
}

export interface OrderReplaceRequest {
  quantity?: string;
  limit_price?: string;
  stop_price?: string;
  /** Required for optimistic concurrency; rejected if it does not match the current order version. */
  expected_version: number;
}

function commandHeaders(idempotencyKey: string, ifMatchVersion?: number): HeadersInit {
  return {
    "Idempotency-Key": idempotencyKey,
    ...(ifMatchVersion !== undefined ? { "If-Match": String(ifMatchVersion) } : {}),
  };
}

export async function previewOrder(token: string, request: OrderRequest): Promise<OrderPreview> {
  return authenticatedRequest<OrderPreview>(apiEndpoints.orders.preview, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function createOrder(
  token: string,
  request: OrderRequest,
  idempotencyKey: string = crypto.randomUUID(),
): Promise<Order> {
  const order = await authenticatedRequest<Order>(apiEndpoints.orders.create, token, {
    method: "POST",
    headers: commandHeaders(idempotencyKey),
    body: JSON.stringify(request),
  });
  if (order.state === "UNKNOWN" || order.state === "RECONCILIATION_REQUIRED") {
    throw new ApiError(409, `ORDER_${order.state}`, crypto.randomUUID());
  }
  return order;
}

export function listOrders(token: string, cursor?: string): Promise<PaginatedResponse<Order>> {
  const endpoint = cursor
    ? `${apiEndpoints.orders.list}?cursor=${encodeURIComponent(cursor)}`
    : apiEndpoints.orders.list;
  return authenticatedRequest<PaginatedResponse<Order>>(endpoint, token);
}

export function getOrder(token: string, orderId: string): Promise<Order> {
  return authenticatedRequest<Order>(apiEndpoints.orders.detail(orderId), token);
}

export function cancelOrder(
  token: string,
  orderId: string,
  expectedVersion: number,
  idempotencyKey: string = crypto.randomUUID(),
): Promise<Order> {
  return authenticatedRequest<Order>(apiEndpoints.orders.cancel(orderId), token, {
    method: "POST",
    headers: commandHeaders(idempotencyKey, expectedVersion),
    body: "{}",
  });
}

export function replaceOrder(
  token: string,
  orderId: string,
  request: OrderReplaceRequest,
  idempotencyKey: string = crypto.randomUUID(),
): Promise<Order> {
  return authenticatedRequest<Order>(apiEndpoints.orders.replace(orderId), token, {
    method: "POST",
    headers: commandHeaders(idempotencyKey, request.expected_version),
    body: JSON.stringify(request),
  });
}

export function getOrderEvents(token: string, orderId: string): Promise<PaginatedResponse<OrderEvent>> {
  return authenticatedRequest<PaginatedResponse<OrderEvent>>(apiEndpoints.orders.events(orderId), token);
}

export function listExecutions(token: string, cursor?: string): Promise<PaginatedResponse<Execution>> {
  const endpoint = cursor
    ? `${apiEndpoints.orders.executions}?cursor=${encodeURIComponent(cursor)}`
    : apiEndpoints.orders.executions;
  return authenticatedRequest<PaginatedResponse<Execution>>(endpoint, token);
}
