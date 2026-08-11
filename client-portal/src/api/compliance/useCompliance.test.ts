import { describe, expect, it } from "vitest";
import { complianceChannels, complianceDisplayState, ComplianceProfile } from "./useCompliance";
const clear: ComplianceProfile={account_state:"ACTIVE",kyc_state:"APPROVED",aml_state:"CLEARED",sanctions_state:"CLEAR",jurisdiction_state:"SUPPORTED",restrictions:[],requirements:[],last_updated:"2026-08-11T00:00:00Z"};
describe("safe compliance display states",()=>{
  it("uses private user-scoped realtime channels",()=>expect(complianceChannels("42")).toEqual(["compliance.profile.updated.v1.42","compliance.requirement.updated.v1.42","compliance.restriction.updated.v1.42"]));
  it("shows approved only when every authority clears",()=>expect(complianceDisplayState(clear)).toBe("Approved"));
  it.each([[{kyc_state:"NOT_STARTED"},"Verification required"],[{kyc_state:"PENDING"},"Verification pending"],[{aml_state:"REVIEW_REQUIRED"},"Manual review"],[{account_state:"SUSPENDED"},"Restricted"],[{kyc_state:"EXPIRED"},"Expired"]] as const)("maps state safely",(change,expected)=>expect(complianceDisplayState({...clear,...change} as ComplianceProfile)).toBe(expected));
});
