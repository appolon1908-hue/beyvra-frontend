import QRCode from "react-qr-code";
import { Link, NavLink } from "react-router-dom";
import FinancialDisabledNotice, { FinancialGateReason } from "components/financial/FinancialDisabledNotice";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";
import { ComplianceRequirement, DepositDestination, DestinationStatus, MoneyActivity, WalletSnapshot, financialStateLabel } from "./types";
import { FinancialNotification } from "./realtime";

export function MoneyMovementShell({ title, description, children }: React.PropsWithChildren<{ title: string; description: string }>) {
  return <main className="money-movement" aria-labelledby="money-movement-title">
    <header className="money-movement__header">
      <div>
        <Link className="money-movement__brand" to="/platform">Beyvra</Link>
        <p className="money-movement__eyebrow">Money movement</p>
        <h1 id="money-movement-title">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="money-movement__mode" role="status" aria-label="Real funds status">
        <span>Real funds</span><strong>Unavailable</strong><small>Money movement is disabled</small>
      </div>
    </header>
    <nav className="money-movement__nav" aria-label="Money movement">
      <NavLink to="/platform/wallet">Wallet</NavLink>
      <NavLink to="/platform/funding">Deposit, withdraw &amp; transfer</NavLink>
      <NavLink to="/platform/activity">Money activity</NavLink>
      <NavLink to="/platform">Demo platform</NavLink>
    </nav>
    <div className="money-movement__demo-separator">
      <strong>Real funds workspace</strong>
      <span>Separate from Demo / Simulation. No virtual balance is shown here.</span>
    </div>
    {children}
  </main>;
}

export function SafeFinancialError({ error }: { error: unknown }) {
  const safe = BeyvraErrorMapper.map(error, "wallet");
  return <div className={`money-alert money-alert--${safe.severity}`} role="alert">
    <strong>{safe.title}</strong><span>{safe.message}</span>
    <Link to="/platform/help">Contact support</Link>
  </div>;
}

export function FinancialEventNotice({ notice, onDismiss }: { notice: FinancialNotification; onDismiss: () => void }) {
  return <div className={`money-alert money-alert--${notice.severity}`} role="status" aria-live="polite">
    <strong>{notice.title}</strong><span>{notice.message}</span>
    <button type="button" onClick={onDismiss}>Dismiss</button>
  </div>;
}

export function WalletGrid({ wallets }: { wallets: WalletSnapshot[] }) {
  return <section className="wallet-grid" aria-label="Real wallet balances">
    {wallets.map((wallet) => <article className="wallet-card" key={wallet.wallet_id}>
      <header><span>{wallet.asset}</span><small>Real funds</small></header>
      <dl>
        <div><dt>Available</dt><dd>{wallet.available} {wallet.asset}</dd></div>
        <div><dt>Reserved</dt><dd>{wallet.reserved} {wallet.asset}</dd></div>
        <div><dt>Pending</dt><dd>{wallet.pending} {wallet.asset}</dd></div>
        <div><dt>Total</dt><dd>{wallet.total} {wallet.asset}</dd></div>
      </dl>
      <footer>Updated <time dateTime={wallet.as_of}>{new Date(wallet.as_of).toLocaleString()}</time></footer>
    </article>)}
  </section>;
}

export function RequirementList({ requirements = [] }: { requirements?: ComplianceRequirement[] }) {
  if (!requirements.length) return null;
  return <section className="requirements" aria-labelledby="requirements-title">
    <h2 id="requirements-title">Requirements</h2>
    <ul>{requirements.map((requirement) => <li key={requirement.code}>
      <strong>{requirement.title || requirement.code.split("_").join(" ")}</strong>
      <span>{requirement.detail || requirementMessage(requirement.code)}</span>
      {requirement.action === "CONTACT_SUPPORT" && <Link to="/platform/help">Contact support</Link>}
    </li>)}</ul>
  </section>;
}

function requirementMessage(code: ComplianceRequirement["code"]): string {
  return ({
    KYC_REQUIRED: "Identity verification is required before this capability can become available.",
    COMPLIANCE_REVIEW_REQUIRED: "Your account requires review before this capability can become available.",
    JURISDICTION_RESTRICTED: "This capability is not available in your jurisdiction.",
    STEP_UP_REQUIRED: "Re-authenticate and complete recent multi-factor verification.",
    DESTINATION_COOLDOWN: "The destination cannot be used until its security cooldown ends.",
  })[code];
}

export function GateNotice({ reason, label }: { reason: FinancialGateReason; label: string }) {
  return <div className="funding-gate"><h2>{label}</h2><FinancialDisabledNotice reason={reason} /></div>;
}

export function DestinationBadge({ status }: { status: DestinationStatus }) {
  return <span className={`destination-status destination-status--${status.toLowerCase()}`} role="status">
    {status.charAt(0) + status.slice(1).toLowerCase()}
  </span>;
}

export function BackendDepositDestination({ destination }: { destination?: DepositDestination }) {
  if (!destination) return <p className="empty-copy">Instructions will appear only after Beyvra returns an approved destination.</p>;
  if (destination.kind === "VIRTUAL_ACCOUNT") return <section className="deposit-instructions" aria-label="Bank transfer instructions">
    <h3>Bank transfer instructions</h3>
    <dl><div><dt>Account name</dt><dd>{destination.account_name}</dd></div>
      {destination.bank_name && <div><dt>Bank</dt><dd>{destination.bank_name}</dd></div>}
      <div><dt>Account</dt><dd>{destination.masked_account}</dd></div>
      {destination.reference && <div><dt>Reference</dt><dd>{destination.reference}</dd></div>}</dl>
  </section>;
  return <section className="deposit-instructions" aria-label="Crypto deposit address">
    <h3>Crypto deposit address</h3>
    <div className="deposit-address"><QRCode value={destination.address} size={112} aria-label="Deposit address QR code" />
      <dl><div><dt>Asset</dt><dd>{destination.asset}</dd></div><div><dt>Network</dt><dd>{destination.network}</dd></div>
        <div><dt>Address</dt><dd className="break-value">{destination.address}</dd></div></dl></div>
    <p className="network-warning" role="note">Send only {destination.asset} using the {destination.network} network. Using another network may result in loss.</p>
  </section>;
}

export function ActivityList({ items, selected, onSelect, onClose }: {
  items: MoneyActivity[]; selected?: MoneyActivity; onSelect: (item: MoneyActivity) => void; onClose: () => void;
}) {
  return <div className="activity-layout">
    <section aria-labelledby="activity-list-title"><h2 id="activity-list-title">Canonical activity</h2>
      {!items.length ? <p className="empty-copy">No real money activity is available.</p> : <ul className="activity-list">
        {items.map((item) => <li key={`${item.type}:${item.id}`}><button type="button" onClick={() => onSelect(item)}>
          <span><strong>{item.type}</strong><small>Real funds</small></span>
          <span>{item.amount} {item.asset}<small>{financialStateLabel(item.state)}</small></span>
        </button></li>)}
      </ul>}
    </section>
    {selected && <aside className="activity-detail" role="dialog" aria-modal="false" aria-labelledby="activity-detail-title">
      <button className="activity-detail__close" type="button" onClick={onClose} aria-label="Close activity details">×</button>
      <p className="money-movement__eyebrow">{selected.mode === "SIMULATION" ? "Demo / Simulation" : "Real funds"}</p>
      <h2 id="activity-detail-title">{selected.type} details</h2>
      <dl><div><dt>Status</dt><dd>{financialStateLabel(selected.state)}</dd></div>
        <div><dt>Amount</dt><dd>{selected.amount} {selected.asset}</dd></div>
        {selected.network && <div><dt>Network / rail</dt><dd>{selected.network}</dd></div>}
        {selected.fee && <div><dt>Fee</dt><dd>{selected.fee} {selected.asset}</dd></div>}
        {selected.destination_masked && <div><dt>Destination</dt><dd>{selected.destination_masked}</dd></div>}
        <div><dt>Updated</dt><dd><time dateTime={selected.occurred_at}>{new Date(selected.occurred_at).toLocaleString()}</time></dd></div>
        {selected.reference && <div><dt>Reference</dt><dd>{selected.reference}</dd></div>}</dl>
      {!["COMPLETED", "CREDITED"].includes(selected.state) && <Link to="/platform/help">Contact support</Link>}
    </aside>}
  </div>;
}
