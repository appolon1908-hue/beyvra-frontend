import { FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { AuditRow, IncidentState, OperatorCase, useOperatorActions, useOperatorControlPlane } from "api/operations/useOperatorControlPlane";
import "./operationalCenter.scss";

const OperatorCenter = () => {
  const [cookies] = useCookies(["access_token"]);
  const token = cookies.access_token as string | undefined;
  const [tenant, setTenant] = useState("default");
  const [accountId, setAccountId] = useState("");
  const [reason, setReason] = useState("");
  const [actionType, setActionType] = useState("UNFREEZE");
  const [targetRef, setTargetRef] = useState("");
  const [approvalReference, setApprovalReference] = useState("");
  const plane = useOperatorControlPlane(token, tenant);
  const actions = useOperatorActions(token, tenant);
  const incidents = (plane.incidents.data ?? {}) as IncidentState;
  const auditRows = (plane.audit.data ?? []) as AuditRow[];
  const failed = [plane.control, plane.incidents, plane.fraudCases, plane.supportCases, plane.audit].some((query) => query.isError);

  const submitAction = (event: FormEvent) => {
    event.preventDefault();
    actions.createAction.mutate(
      { action_type: actionType, target_ref: targetRef, reason },
      { onSuccess: (created) => setApprovalReference(created.request_id) },
    );
  };

  return <main className="operational-center operator-center" aria-labelledby="operator-center-title">
    <header><p className="eyebrow">Internal operator plane</p><h1 id="operator-center-title">Governed operations</h1><p>All data and actions are tenant-scoped, MFA-protected, role-authorized, and audited. Financial providers and real-money controls remain disabled.</p></header>
    <section aria-labelledby="scope-title"><h2 id="scope-title">Tenant scope</h2><label className="operator-field">Tenant identifier<input value={tenant} onChange={(event) => setTenant(event.target.value)} autoComplete="off" /></label>{failed && <p role="alert">This role is not authorized for one or more operator views, or the service is temporarily unavailable.</p>}</section>
    <section aria-labelledby="controls-title"><h2 id="controls-title">Authoritative control state</h2><div className="operator-grid">{Object.entries(plane.control.data?.safety_flags ?? {}).map(([name, enabled]) => <article className="operation-card" key={name}><strong>{name}</strong><span className="status">{enabled ? "ENABLED" : "DISABLED"}</span></article>)}</div><p>Providers: {Object.entries(plane.control.data?.providers ?? {}).map(([name, state]) => `${name} ${state}`).join(" · ") || "Loading…"}</p><p>Trading: simulation {plane.control.data?.trading.simulation ? "enabled" : "disabled"}; emergency halt {plane.control.data?.trading.emergency_halt ? "ACTIVE" : "inactive"}.</p></section>
    <section aria-labelledby="incidents-title"><h2 id="incidents-title">Incidents and queues</h2><div className="operator-grid">{Object.entries(incidents).flatMap(([domain, values]) => Object.entries(values).map(([name, count]) => <article className="operation-card" key={`${domain}-${name}`}><div><strong>{domain}</strong><span>{name.replace(/_/g, " ")}</span></div><span className="status">{count}</span></article>))}</div></section>
    <section aria-labelledby="account-title"><h2 id="account-title">Masked account troubleshooting</h2><form className="operation-form" onSubmit={(event) => { event.preventDefault(); actions.accountSummary.mutate(accountId); }}><label>Opaque account reference<input inputMode="numeric" pattern="[0-9]+" value={accountId} onChange={(event) => setAccountId(event.target.value)} required /></label><button disabled={actions.accountSummary.isPending}>Load safe summary</button></form>{actions.accountSummary.data && <article className="operation-card"><div><strong>Account {actions.accountSummary.data.account_ref}</strong><span>{actions.accountSummary.data.account_state} · verification {String(actions.accountSummary.data.verification_summary.status)} · {actions.accountSummary.data.open_support_cases} open support cases</span><span>Restriction: {actions.accountSummary.data.active_restriction?.level ?? "NONE"}</span></div></article>}</section>
    <section aria-labelledby="queues-title"><h2 id="queues-title">Case queues</h2><div className="operator-grid">{[...(plane.fraudCases.data?.results ?? []), ...(plane.supportCases.data?.results ?? [])].map((item: OperatorCase) => <article className="operation-card" key={item.case_id}><div><strong>{item.category ?? item.risk_level ?? "CASE"}</strong><span>{item.safe_summary ?? "Restricted case summary"}</span></div><span className="status">{item.status}</span></article>)}</div></section>
    <section aria-labelledby="emergency-title"><h2 id="emergency-title">Emergency controls</h2><div className="operation-form"><label>Reason<input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} /></label><div className="button-row"><button className="danger" disabled={!reason.trim() || actions.halt.isPending} onClick={() => actions.halt.mutate({ reason })}>Activate trading halt</button><button disabled={!accountId || !reason.trim() || actions.freeze.isPending} onClick={() => actions.freeze.mutate({ accountId, level: "FULL", reason_code: "ACCOUNT_REVIEW_REQUIRED" })}>Freeze account</button></div><p>Halt release and account unfreeze require an independently approved action request.</p></div></section>
    <section aria-labelledby="maker-title"><h2 id="maker-title">Maker / checker</h2><form className="operation-form" onSubmit={submitAction}><label>Action type<select value={actionType} onChange={(event) => setActionType(event.target.value)}>{["UNFREEZE", "COMPLIANCE_OVERRIDE", "FINANCIAL_OVERRIDE", "WITHDRAWAL_OVERRIDE", "PROVIDER_ACTIVATION", "REAL_MONEY_ACTIVATION", "KILL_SWITCH_RELEASE", "LEGAL_HOLD_RELEASE"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Target reference<input value={targetRef} onChange={(event) => setTargetRef(event.target.value)} maxLength={128} required /></label><button disabled={!reason.trim() || actions.createAction.isPending}>Create governed request</button></form><div className="operation-form"><label>Approval reference<input value={approvalReference} onChange={(event) => setApprovalReference(event.target.value)} /></label><div className="button-row"><button disabled={!approvalReference || actions.approve.isPending} onClick={() => actions.approve.mutate(approvalReference)}>Approve independently</button><button disabled={!approvalReference || actions.execute.isPending} onClick={() => actions.execute.mutate(approvalReference)}>Execute approved request</button></div></div></section>
    <section aria-labelledby="audit-title"><h2 id="audit-title">Role-filtered audit timeline</h2><div className="table-scroll" tabIndex={0} aria-label="Scrollable operator audit timeline"><table><thead><tr><th>Time</th><th>Action</th><th>Target</th><th>Role</th></tr></thead><tbody>{auditRows.map((row) => <tr key={row.audit_id}><td>{new Date(row.timestamp).toLocaleString()}</td><td>{row.action}</td><td>{row.target}</td><td>{row.role || "system"}</td></tr>)}</tbody></table></div></section>
  </main>;
};

export default OperatorCenter;
