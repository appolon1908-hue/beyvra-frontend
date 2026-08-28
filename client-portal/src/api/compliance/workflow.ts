import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { PaginatedResponse } from "api/types";

export interface ComplianceStatus {
  account_state: string;
  kyc_state: string;
  aml_state: string;
  sanctions_state: string;
  jurisdiction_state: string;
  as_of: string;
}

export interface ComplianceDocumentRequest {
  document_type: string;
  file_reference: string;
}

export interface ComplianceDocument {
  id: string;
  document_type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submitted_at: string;
}

export interface ComplianceRestriction {
  restriction_id: string;
  type: string;
  reason_code: string;
  policy_version: string;
  expires_at: string | null;
}

export interface ComplianceAcknowledgementRequest {
  policy_version: string;
  reason_codes: string[];
}

export interface ComplianceAcknowledgement {
  id: string;
  policy_version: string;
  reason_codes: string[];
  acknowledged_at: string;
}

export function getComplianceStatus(token: string): Promise<ComplianceStatus> {
  return authenticatedRequest<ComplianceStatus>(apiEndpoints.compliance.status, token);
}

export function submitComplianceDocument(token: string, request: ComplianceDocumentRequest): Promise<ComplianceDocument> {
  return authenticatedRequest<ComplianceDocument>(apiEndpoints.compliance.documents, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function listComplianceRestrictions(token: string): Promise<PaginatedResponse<ComplianceRestriction>> {
  return authenticatedRequest<PaginatedResponse<ComplianceRestriction>>(apiEndpoints.compliance.restrictions, token);
}

export function submitComplianceAcknowledgement(
  token: string,
  request: ComplianceAcknowledgementRequest,
): Promise<ComplianceAcknowledgement> {
  return authenticatedRequest<ComplianceAcknowledgement>(apiEndpoints.compliance.acknowledgements, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
