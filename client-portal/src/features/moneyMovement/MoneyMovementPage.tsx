import { useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import {
  ActivityList, BackendDepositDestination, FinancialEventNotice, GateNotice, MoneyMovementShell,
  RequirementList, SafeFinancialError, WalletGrid,
} from "./components";
import { useCompliance, useFinancialFeatures, useMoneyActivity, useWalletSnapshots } from "./useMoneyMovement";
import { ComplianceRequirement, MoneyActivity } from "./types";
import { useAppSelector } from "@store/hooks";
import { useFinancialRealtime } from "./realtime";
import "./moneyMovement.scss";

type Section = "wallet" | "funding" | "activity";

export default function MoneyMovementPage({ section: explicitSection }: { section?: Section }) {
  const location = useLocation();
  const section = explicitSection ?? (location.pathname.endsWith("/funding") ? "funding" : location.pathname.endsWith("/activity") ? "activity" : "wallet");
  const [cookies] = useCookies(["access_token"]);
  const token = cookies.access_token as string | undefined;
  const sessionUserId = Number(useAppSelector((state) => state.user.user?.id));
  const wsTicket = useAppSelector((state) => state.user.wsTicket);
  const features = useFinancialFeatures(token);
  const compliance = useCompliance(token, features.isSuccess);
  const walletReadEnabled = features.data?.realWalletReadEnabled === true;
  const wallets = useWalletSnapshots(token, walletReadEnabled);
  const activity = useMoneyActivity(token, walletReadEnabled);
  const realtime = useFinancialRealtime({ enabled: walletReadEnabled, token, sessionUserId, wsTicket });

  if (section === "funding") return <FundingWorkspace
    requirements={compliance.requirements.data}
    complianceError={compliance.requirements.error}
    realtimeNotice={realtime.notice}
    dismissRealtimeNotice={realtime.dismiss}
  />;
  if (section === "activity") return <ActivityWorkspace
    enabled={walletReadEnabled} items={activity.data || []} error={activity.error}
    realtimeNotice={realtime.notice} dismissRealtimeNotice={realtime.dismiss}
  />;
  return <MoneyMovementShell title="Wallet" description="A provider-neutral view of backend-authoritative real wallet snapshots.">
    {realtime.notice && <FinancialEventNotice notice={realtime.notice} onDismiss={realtime.dismiss} />}
    {!walletReadEnabled && <GateNotice reason="FEATURE_DISABLED" label="Real wallet" />}
    {walletReadEnabled && wallets.isPending && <p role="status">Loading wallet snapshot…</p>}
    {walletReadEnabled && wallets.error && <SafeFinancialError error={wallets.error} />}
    {walletReadEnabled && wallets.data && <WalletGrid wallets={wallets.data} />}
    <section className="simulation-callout" aria-labelledby="simulation-title">
      <div><p className="money-movement__eyebrow">Demo / Simulation</p><h2 id="simulation-title">Virtual funds stay separate</h2>
        <p>Practice balances have no monetary value and never appear as real wallet funds.</p></div>
      <a href="/platform">Open Demo platform</a>
    </section>
  </MoneyMovementShell>;
}

function FundingWorkspace({ requirements, complianceError, realtimeNotice, dismissRealtimeNotice }: {
  requirements?: ComplianceRequirement[];
  complianceError?: unknown;
  realtimeNotice?: Parameters<typeof FinancialEventNotice>[0]["notice"];
  dismissRealtimeNotice?: () => void;
}) {
  const [tab, setTab] = useState<"deposit" | "withdraw" | "transfer">("deposit");
  const labels = { deposit: "Deposit", withdraw: "Withdraw", transfer: "Transfer" };
  return <MoneyMovementShell title="Deposit, withdraw & transfer" description="Future money movement controls, governed entirely by Beyvra eligibility and feature policy.">
    {realtimeNotice && <FinancialEventNotice notice={realtimeNotice} onDismiss={dismissRealtimeNotice || (() => undefined)} />}
    <div className="funding-tabs" role="tablist" aria-label="Money movement type">
      {(Object.keys(labels) as Array<keyof typeof labels>).map((value) => <button key={value} type="button" role="tab"
        aria-selected={tab === value} aria-controls={`funding-panel-${value}`} id={`funding-tab-${value}`}
        onClick={() => setTab(value)}>{labels[value]}</button>)}
    </div>
    <section className="funding-panel" role="tabpanel" id={`funding-panel-${tab}`} aria-labelledby={`funding-tab-${tab}`}>
      {tab === "deposit" && <DisabledDeposit />}
      {tab === "withdraw" && <DisabledWithdrawal />}
      {tab === "transfer" && <DisabledTransfer />}
    </section>
    {Boolean(complianceError) && <SafeFinancialError error={complianceError} />}
    <RequirementList requirements={requirements} />
  </MoneyMovementShell>;
}

function DisabledDeposit() {
  return <div className="flow-grid"><div>
    <GateNotice reason="FEATURE_DISABLED" label="Deposit" />
    <fieldset disabled aria-describedby="deposit-disabled-detail"><legend>Future deposit request</legend>
      <label>Asset<select aria-label="Deposit asset"><option>Select an asset</option></select></label>
      <label>Network / rail<select aria-label="Deposit network or rail"><option>Provided by Beyvra</option></select></label>
      <button type="button">Create deposit instructions</button>
    </fieldset>
    <p id="deposit-disabled-detail" className="sr-only">Deposits are not currently available.</p>
  </div><BackendDepositDestination /></div>;
}

function DisabledWithdrawal() {
  return <div className="flow-grid"><div>
    <GateNotice reason="FEATURE_DISABLED" label="Withdrawal" />
    <fieldset disabled aria-describedby="withdrawal-disabled-detail"><legend>Future withdrawal request</legend>
      <label>Asset<select><option>Select an asset</option></select></label>
      <label>Network / rail<select><option>Provided by Beyvra</option></select></label>
      <label>Verified destination<select><option>Choose a masked destination</option></select></label>
      <label>Amount<input inputMode="decimal" placeholder="0.00" /></label>
      <div className="preview-summary" aria-label="Withdrawal preview"><span>Estimated fee<strong>—</strong></span>
        <span>Estimated receive<strong>—</strong></span><span>Limits<strong>Provided by Beyvra</strong></span></div>
      <button type="button">Review withdrawal</button>
    </fieldset>
    <p id="withdrawal-disabled-detail" className="sr-only">Withdrawals are not currently available.</p>
  </div><aside className="security-card"><h3>Security requirements</h3><ul>
    <li>Recent authenticated session</li><li>Recent multi-factor verification</li>
    <li>Verified destination outside cooldown</li><li>Backend-authoritative eligibility and limits</li>
  </ul><p>No provider authentication occurs in this browser.</p></aside></div>;
}

function DisabledTransfer() {
  return <div className="flow-grid"><div>
    <GateNotice reason="FEATURE_DISABLED" label="Internal transfer" />
    <fieldset disabled aria-describedby="transfer-disabled-detail"><legend>Future internal transfer</legend>
      <label>Asset<select><option>Select an asset</option></select></label>
      <label>Destination account<input placeholder="Beyvra account reference" /></label>
      <label>Amount<input inputMode="decimal" placeholder="0.00" /></label>
      <button type="button">Review transfer</button>
    </fieldset>
    <p id="transfer-disabled-detail" className="sr-only">Transfers are not currently available.</p>
  </div><aside className="security-card"><h3>Isolation</h3><p>Transfers cannot cross tenant, account-mode, or Demo / Real boundaries. Preview and review create no financial effect.</p></aside></div>;
}

function ActivityWorkspace({ enabled, items, error, realtimeNotice, dismissRealtimeNotice }: {
  enabled: boolean;
  items: MoneyActivity[];
  error: unknown;
  realtimeNotice?: Parameters<typeof FinancialEventNotice>[0]["notice"];
  dismissRealtimeNotice?: () => void;
}) {
  const [selected, setSelected] = useState<MoneyActivity>();
  return <MoneyMovementShell title="Money activity" description="Deposits, withdrawals, transfers, fees, and settlements from canonical Beyvra history.">
    {realtimeNotice && <FinancialEventNotice notice={realtimeNotice} onDismiss={dismissRealtimeNotice || (() => undefined)} />}
    {!enabled && <GateNotice reason="FEATURE_DISABLED" label="Real money activity" />}
    {enabled && Boolean(error) && <SafeFinancialError error={error} />}
    {enabled && !error && <ActivityList items={items} selected={selected} onSelect={setSelected} onClose={() => setSelected(undefined)} />}
  </MoneyMovementShell>;
}
