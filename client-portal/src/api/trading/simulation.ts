import { authenticatedRequest, ApiError } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type SimulationSide = "BUY" | "SELL";
export type SimulationOrderState =
  | "PENDING" | "ACCEPTED" | "OPEN" | "PARTIALLY_FILLED" | "FILLED"
  | "CANCEL_PENDING" | "CANCELLED" | "REJECTED" | "EXPIRED";

export type SimulationOrderRequest = {
  instrument: string;
  side: SimulationSide;
  order_type: "MARKET" | "LIMIT";
  quantity: string;
};

export type SimulationPreview = SimulationOrderRequest & {
  decision: "ALLOW" | "DENY" | "REVIEW";
  reason_codes: string[];
  price: string;
  notional: string;
  estimated_fee: string;
  available_simulated_balance: string;
  simulation: true;
};

export type SimulationOrder = {
  id: string;
  instrument: string;
  side: SimulationSide;
  order_type: "MARKET" | "LIMIT";
  quantity: string;
  filled_quantity: string;
  state: SimulationOrderState;
  version: string;
  simulation: true;
};

const simulationHeaders = { "X-Beyvra-Simulation-Mode": "true" };

export type SimulationPosition = { id: string; instrument: string; quantity: string; average_price: string; realized_pnl: string; simulation: true };
export type SimulationAccount = { id: string; account_ref: string; currency: string; total: string; available: string; reserved: string; pending: string; simulation: true };

function list<T>(endpoint: string, token: string) {
  return authenticatedRequest<{ results: T[] }>(endpoint, token, { headers: simulationHeaders });
}

export const listSimulationOrders = (token: string) => list<SimulationOrder>(apiEndpoints.simulationTrading.orders, token);
export const listSimulationPositions = (token: string) => list<SimulationPosition>(apiEndpoints.simulationTrading.positions, token);
export const listSimulationAccounts = (token: string) => list<SimulationAccount>(apiEndpoints.simulationTrading.accounts, token);

export async function previewSimulationOrder(token: string, order: SimulationOrderRequest) {
  const result = await authenticatedRequest<SimulationPreview>(apiEndpoints.simulationTrading.preview, token, {
    method: "POST",
    headers: simulationHeaders,
    body: JSON.stringify(order),
  });
  if (result.decision !== "ALLOW") throw new ApiError(409, result.reason_codes[0] || "ORDER_REVIEW_REQUIRED", crypto.randomUUID());
  return result;
}

export function createSimulationOrder(token: string, order: SimulationOrderRequest, idempotencyKey: string = crypto.randomUUID()) {
  return authenticatedRequest<SimulationOrder>(apiEndpoints.simulationTrading.orders, token, {
    method: "POST",
    headers: { ...simulationHeaders, "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(order),
  });
}

export function cancelSimulationOrder(token: string, orderId: string, expectedVersion: string, idempotencyKey: string = crypto.randomUUID()) {
  return authenticatedRequest<SimulationOrder>(apiEndpoints.simulationTrading.cancel(orderId), token, {
    method: "POST",
    headers: { ...simulationHeaders, "Idempotency-Key": idempotencyKey, "If-Match": expectedVersion },
    body: "{}",
  });
}
