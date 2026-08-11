import { FormEvent, useState } from "react";
import { Session, SupportCase, SupportCategory, Transaction, useCreateActivityExport, useCreatePrivacyExport, useCreateSupportCase, useOperationalControlPlane, useRequestAccountDeletion, useRevokeOtherSessions, useRevokeSession } from "api/operations/useOperationalControlPlane";
import "./operationalCenter.scss";

const OperationalCenter = () => {
  const { cases, sessions, transactions, token } = useOperationalControlPlane();
  const revokeSession = useRevokeSession(token);
  const revokeOthers = useRevokeOtherSessions(token);
  const createCase = useCreateSupportCase(token);
  const activityExport = useCreateActivityExport(token);
  const privacyExport = useCreatePrivacyExport(token);
  const deletionRequest = useRequestAccountDeletion(token);
  const [category, setCategory] = useState<SupportCategory>("ACCOUNT_ACCESS");
  const [summary, setSummary] = useState("");
  const loading = cases.isLoading || sessions.isLoading || transactions.isLoading;

  const submitCase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCase.mutate({ category, safe_summary: summary }, { onSuccess: () => setSummary("") });
  };

  return (
    <main className="operational-center" aria-labelledby="operational-center-title">
      <header>
        <p className="eyebrow">Account operations</p>
        <h1 id="operational-center-title">Security, support and records</h1>
        <p>Review active sessions, support cases, and authoritative simulation activity. Real-money features remain unavailable.</p>
      </header>
      {loading && <p role="status">Loading account operations…</p>}
      {(cases.isError || sessions.isError || transactions.isError) && <p role="alert">Account operations are temporarily unavailable. Please try again.</p>}

      <section aria-labelledby="sessions-title">
        <h2 id="sessions-title">Active sessions</h2>
        {(sessions.data ?? []).map((session: Session) => (
          <article key={session.session_id} className="operation-card">
            <div><strong>{session.auth_strength}</strong><span>Last active {new Date(session.last_seen_at).toLocaleString()}</span></div>
            <button type="button" onClick={() => revokeSession.mutate(session.session_id)} disabled={revokeSession.isPending}>Revoke session</button>
            <button type="button" className="secondary" onClick={() => revokeOthers.mutate(session.session_id)} disabled={revokeOthers.isPending}>Keep this session; revoke others</button>
          </article>
        ))}
        {!sessions.isLoading && !sessions.data?.length && <p>No active sessions were found.</p>}
      </section>

      <section aria-labelledby="support-title">
        <h2 id="support-title">Support cases</h2>
        <form className="operation-form" onSubmit={submitCase}>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value as SupportCategory)}>{["ACCOUNT_ACCESS", "TRADING", "MARKET_DATA", "DEMO", "PAYMENTS", "WITHDRAWAL", "DEPOSIT", "COMPLIANCE", "SECURITY", "BUG", "TECHNICAL", "OTHER"].map((value) => <option key={value} value={value}>{value.replace(/_/g, " ")}</option>)}</select></label>
          <label>How can support help?<textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} required /></label>
          <button type="submit" disabled={createCase.isPending || !summary.trim()}>{createCase.isPending ? "Opening…" : "Open support case"}</button>
          {createCase.isError && <p role="alert">The support case could not be opened. Please try again.</p>}
          {createCase.isSuccess && <p role="status">Your support case was opened.</p>}
        </form>
        {(cases.data?.results ?? []).map((item: SupportCase) => <article key={item.case_id} className="operation-card"><div><strong>{item.category.replace(/_/g, " ")}</strong><span>{item.safe_summary}</span></div><span className="status">{item.status}</span></article>)}
        {!cases.isLoading && !cases.data?.results.length && <p>No open or recent support cases.</p>}
      </section>

      <section aria-labelledby="activity-title">
        <h2 id="activity-title">Transaction history</h2>
        <div className="table-scroll" tabIndex={0} aria-label="Scrollable transaction history">
          <table><thead><tr><th>Date</th><th>Type</th><th>Asset</th><th>Amount</th><th>Fee</th><th>Environment</th></tr></thead>
          <tbody>{(transactions.data?.results ?? []).map((entry: Transaction) => <tr key={entry.entry_id}><td>{new Date(entry.occurred_at).toLocaleString()}</td><td>{entry.type}</td><td>{entry.asset}</td><td>{entry.amount}</td><td>{entry.fee}</td><td>{entry.simulation ? "Simulation" : "Real"}</td></tr>)}</tbody></table>
        </div>
        <button type="button" onClick={() => activityExport.mutate()} disabled={activityExport.isPending}>Request activity export</button>
        {activityExport.isSuccess && <p role="status">Your private activity export is queued.</p>}
      </section>

      <section aria-labelledby="privacy-title">
        <h2 id="privacy-title">Privacy requests</h2>
        <p>Exports are private and expire. A deletion request never removes financial, compliance, audit, or legally held records automatically.</p>
        <div className="button-row">
          <button type="button" onClick={() => privacyExport.mutate()} disabled={privacyExport.isPending}>Request my data export</button>
          <button type="button" className="danger" onClick={() => deletionRequest.mutate()} disabled={deletionRequest.isPending}>Request account deletion review</button>
        </div>
        {privacyExport.isSuccess && <p role="status">Your private data export is queued.</p>}
        {deletionRequest.data && <p role="status">Deletion review requested. Status: {deletionRequest.data.status}{deletionRequest.data.blocked_by_legal_hold ? ". A legal hold prevents automated deletion." : "."}</p>}
        {(privacyExport.isError || deletionRequest.isError) && <p role="alert">The privacy request could not be submitted. Please try again.</p>}
      </section>
    </main>
  );
};

export default OperationalCenter;
