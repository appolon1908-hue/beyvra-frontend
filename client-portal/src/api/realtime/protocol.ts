import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type RealtimeEventKind =
  | "price"
  | "candle"
  | "order_state"
  | "fill"
  | "position"
  | "balance"
  | "compliance_restriction"
  | "system_degradation";

/** Versioned realtime envelope shared by every canonical event kind. */
export interface RealtimeEventEnvelope<TPayload = unknown> {
  event_id: string;
  kind: RealtimeEventKind;
  sequence: number;
  tenant_id: string;
  account_id: string | null;
  aggregate_version: number;
  occurred_at: string;
  schema_version: string;
  payload: TPayload;
}

export interface RealtimeSnapshotRequest {
  channels: string[];
}

export interface RealtimeSnapshotResponse {
  channel: string;
  sequence: number;
  snapshot: RealtimeEventEnvelope[];
}

export interface RealtimeResumeRequest {
  channel: string;
  /** Last sequence the client successfully processed for this channel. */
  from_sequence: number;
}

export interface RealtimeResumeResponse {
  channel: string;
  events: RealtimeEventEnvelope[];
  /** True when the gap is too large to replay and the client must re-snapshot. */
  gap_exceeded: boolean;
}

export function fetchRealtimeSnapshot(
  token: string,
  request: RealtimeSnapshotRequest,
): Promise<RealtimeSnapshotResponse[]> {
  return authenticatedRequest<RealtimeSnapshotResponse[]>(apiEndpoints.realtime.snapshot, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function fetchRealtimeResume(
  token: string,
  request: RealtimeResumeRequest,
): Promise<RealtimeResumeResponse> {
  return authenticatedRequest<RealtimeResumeResponse>(apiEndpoints.realtime.resume, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
