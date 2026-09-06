import { Dispatch, SetStateAction } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { complianceDisplayState, ComplianceRequirement, useComplianceProfile, useComplianceRealtime, useComplianceRequirements } from "api/compliance/useCompliance";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";
import { RightSubDrawerContent } from "../../types";
import "./verificationMenu.scss";

interface VerificationMenuProps { setIsRightSubDrawerOpen?: Dispatch<SetStateAction<boolean>>; setIsRightSubDrawerContent?: Dispatch<SetStateAction<RightSubDrawerContent>>; }
const copy={"Verification required":"Complete identity verification to continue.","Verification pending":"We are reviewing your verification information.","Manual review":"Your account is being reviewed.","Restricted":"Some account actions are currently unavailable.","Approved":"Your account verification is complete.","Expired":"Your verification information needs to be updated."} as const;

export const ComplianceStatusContent=({state,requirements,onContinue}:{state:keyof typeof copy;requirements:ComplianceRequirement[];onContinue:()=>void})=><section className="verificationsContainer max-w-3xl m-auto" aria-labelledby="compliance-title">
  <h2 id="compliance-title">Account verification</h2><p className="text-lg font-semibold" data-testid="compliance-state">{state}</p><p>{copy[state]}</p>
  {requirements.length?<div><h3>What you need to do</h3><ul>{requirements.map((x:ComplianceRequirement)=><li key={x.requirement_id}>{x.user_action||"Provide the requested verification information."}</li>)}</ul></div>:null}
  {(state==="Verification required"||state==="Expired")&&<button type="button" onClick={onContinue}>Continue verification</button>}
</section>;

const VerificationMenu=(_props:VerificationMenuProps)=>{
  const [cookies]=useCookies(["access_token"]); const navigate=useNavigate();
  const userId = useAppSelector((state) => state.user.user?.id);
  useComplianceRealtime(cookies.access_token, userId == null ? undefined : String(userId));
  const profile=useComplianceProfile(cookies.access_token); const requirements=useComplianceRequirements(cookies.access_token);
  if(profile.isLoading) return <div className="verificationsContainer max-w-3xl m-auto" role="status">Loading verification status…</div>;
  if(profile.error||!profile.data) return <div className="verificationsContainer max-w-3xl m-auto" role="alert">{BeyvraErrorMapper.text(profile.error,"generic")}</div>;
  const state=complianceDisplayState(profile.data);
  return <ComplianceStatusContent state={state} requirements={requirements.data?.results.filter((x:ComplianceRequirement)=>x.required&&x.status!=="COMPLETED")||[]} onContinue={()=>navigate("/kyc-document/?query=biodata-kyc")}/>;
};
export default VerificationMenu;
