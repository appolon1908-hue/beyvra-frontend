import { renderToStaticMarkup } from "react-dom/server";
import { describe,expect,it } from "vitest";
import { ComplianceStatusContent } from "./VerificationMenu";

describe("compliance status presentation",()=>{
  it.each(["Verification required","Verification pending","Manual review","Restricted","Approved","Expired"] as const)("renders safe %s state",state=>{
    const html=renderToStaticMarkup(<ComplianceStatusContent state={state} requirements={[]} onContinue={()=>undefined}/>); expect(html).toContain(state); expect(html).not.toMatch(/provider|risk score|case note|request.?id|stack trace|sanctions match/i);
  });
  it("renders only the user action from a requirement",()=>{
    const html=renderToStaticMarkup(<ComplianceStatusContent state="Verification required" requirements={[{requirement_id:"fixture",type:"IDENTITY_VERIFICATION",status:"OPEN",required:true,deadline:null,user_action:"Upload an identity document."}]} onContinue={()=>undefined}/>); expect(html).toContain("Upload an identity document."); expect(html).not.toContain("IDENTITY_VERIFICATION");
  });
});
