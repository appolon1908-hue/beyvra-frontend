import { Session, SupportCase, Transaction, useOperationalControlPlane, useRevokeSession } from "api/operations/useOperationalControlPlane";
import "./operationalCenter.scss";

const OperationalCenter = () => {
  const { cases, sessions, transactions, token } = useOperationalControlPlane();
  const revokeSession = useRevokeSession(token);
  const loading = cases.isLoading || sessions.isLoading || transactions.isLoading;

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
          </article>
        ))}
        {!sessions.isLoading && !sessions.data?.length && <p>No active sessions were found.</p>}
      </section>

      <section aria-labelledby="support-title">
        <h2 id="support-title">Support cases</h2>
        {(cases.data?.results ?? []).map((item: SupportCase) => <article key={item.case_id} className="operation-card"><div><strong>{item.category.replace(/_/g, " ")}</strong><span>{item.safe_summary}</span></div><span className="status">{item.status}</span></article>)}
        {!cases.isLoading && !cases.data?.results.length && <p>No open or recent support cases.</p>}
      </section>

      <section aria-labelledby="activity-title">
        <h2 id="activity-title">Transaction history</h2>
        <div className="table-scroll" tabIndex={0} aria-label="Scrollable transaction history">
          <table><thead><tr><th>Date</th><th>Type</th><th>Asset</th><th>Amount</th><th>Fee</th><th>Environment</th></tr></thead>
          <tbody>{(transactions.data?.results ?? []).map((entry: Transaction) => <tr key={entry.entry_id}><td>{new Date(entry.occurred_at).toLocaleString()}</td><td>{entry.type}</td><td>{entry.asset}</td><td>{entry.amount}</td><td>{entry.fee}</td><td>{entry.simulation ? "Simulation" : "Real"}</td></tr>)}</tbody></table>
        </div>
      </section>
    </main>
  );
};

export default OperationalCenter;
