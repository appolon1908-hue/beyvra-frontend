import { Alert } from "antd";

export type FinancialGateReason = "FEATURE_DISABLED" | "COMPLIANCE_REVIEW_REQUIRED" | "STEP_UP_REQUIRED" | "SERVICE_TEMPORARILY_UNAVAILABLE";

const messages: Record<FinancialGateReason, { title: string; detail: string }> = {
  FEATURE_DISABLED: { title: "Real-money services are unavailable", detail: "Deposits, withdrawals, and transfers are disabled. No financial request has been created." },
  COMPLIANCE_REVIEW_REQUIRED: { title: "Compliance review required", detail: "This action is unavailable until the required review is complete." },
  STEP_UP_REQUIRED: { title: "Additional verification required", detail: "Re-authenticate and complete recent multi-factor verification before continuing." },
  SERVICE_TEMPORARILY_UNAVAILABLE: { title: "Financial service temporarily unavailable", detail: "No request was submitted. Please try again later." },
};

export default function FinancialDisabledNotice({ reason = "FEATURE_DISABLED" }: { reason?: FinancialGateReason }) {
  const content = messages[reason];
  return (
    <section aria-live="polite" data-testid="financial-disabled-state">
      <Alert type="info" showIcon message={content.title} description={content.detail} />
    </section>
  );
}
