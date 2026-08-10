import { useCallback, useEffect, useState, type FormEvent } from "react";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { getApiUrl } from "utils/env";
import { beyvraIntegrationsApi } from "api/generated/beyvra";
import { useCookies } from "react-cookie";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

type ImportJob = { id: string; status: string; file_name: string; row_count: number; valid_count: number; invalid_count: number };
type CRMConnection = { id: string; name: string; endpoint: string; provider: string; is_active: boolean };

export default function IntegrationsAdmin() {
  const [{ access_token: token }] = useCookies(["access_token"]);
  const [imports, setImports] = useState<ImportJob[]>([]);
  const [connections, setConnections] = useState<CRMConnection[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ external_user_id: "", first_name: "", last_name: "", email: "", phone: "", organization_id: "", terms_accepted: true });
  const [crm, setCrm] = useState({ name: "", endpoint: "", secret: "" });
  const load = useCallback(async () => {
    try {
      setConnections(await authenticatedRequest<CRMConnection[]>(apiEndpoints.integrations.crmConnections, token));
    } catch (error) { logInternalError(error, { endpoint: "integrations.load" }); setMessage(toUserSafeErrorText(error, "admin")); }
  }, [token]);
  useEffect(() => { if (token) void load(); }, [load, token]);
  const upload = async (file: File) => {
    const body = new FormData(); body.append("file", file);
    const payload = await beyvraIntegrationsApi.importUsers<ImportJob>(token, body, crypto.randomUUID());
    setImports((current) => [payload, ...current]); setMessage("CSV uploaded. Review the preview before committing.");
  };
  const act = async (id: string, action: "commit" | "cancel") => {
    const endpoint = action === "commit" ? apiEndpoints.integrations.importCommit(id) : apiEndpoints.integrations.importCancel(id);
    await authenticatedRequest(endpoint, token, { method: "POST", body: "{}" });
    setMessage(`Import ${action} requested.`);
  };
  const createUser = async (event: FormEvent) => { event.preventDefault(); const payload = { ...user, consent: { terms_accepted: user.terms_accepted } }; await authenticatedRequest(apiEndpoints.integrations.users, token, { method: "POST", body: JSON.stringify(payload), headers: { "Idempotency-Key": crypto.randomUUID() } }); setMessage("User created with a $2,000.00 virtual demo account."); };
  const createCRM = async (event: FormEvent) => { event.preventDefault(); await authenticatedRequest(apiEndpoints.integrations.crmConnections, token, { method: "POST", body: JSON.stringify({ ...crm, provider: "generic_webhook", event_categories: ["user.created", "demo_account.created"] }) }); setCrm({ name: "", endpoint: "", secret: "" }); setMessage("CRM connection saved disabled by default."); void load(); };
  return <main style={{ maxWidth: 960, margin: "2rem auto", padding: "1rem", color: "#fff" }}>
    <h1>Users & CRM integrations</h1>
    <p>Imported users receive one Demo Account with $2,000.00 USD virtual funds. Not real money, withdrawable, or transferable.</p>
    {message && <p role="status">{message}</p>}
    <section><h2>Create user</h2><form onSubmit={(event) => void createUser(event)}><input required placeholder="External user ID" value={user.external_user_id} onChange={(e) => setUser({ ...user, external_user_id: e.target.value })} /><input required placeholder="First name" value={user.first_name} onChange={(e) => setUser({ ...user, first_name: e.target.value })} /><input required placeholder="Last name" value={user.last_name} onChange={(e) => setUser({ ...user, last_name: e.target.value })} /><input required type="email" placeholder="Email (example.invalid)" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} /><input required placeholder="Phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} /><input required placeholder="Organization ID" value={user.organization_id} onChange={(e) => setUser({ ...user, organization_id: e.target.value })} /><button type="submit">Create pending user</button></form></section>
    <section><h2>Bulk user import</h2><a href={getApiUrl(apiEndpoints.integrations.importTemplate)} download>Download CSV template</a><input aria-label="Upload users CSV" type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file).catch((error) => { logInternalError(error, { endpoint: "integrations.import" }); setMessage(toUserSafeErrorText(error, "admin")); }); }} />
      {imports.map((job) => <article key={job.id}><strong>{job.file_name}</strong> — {job.status} ({job.valid_count} valid, {job.invalid_count} invalid) <button onClick={() => void act(job.id, "commit")}>Commit</button><button onClick={() => void act(job.id, "cancel")}>Cancel</button></article>)}
    </section>
    <section><h2>CRM connections</h2><form onSubmit={(event) => void createCRM(event)}><input required placeholder="Connection name" value={crm.name} onChange={(e) => setCrm({ ...crm, name: e.target.value })} /><input required type="url" placeholder="HTTPS endpoint" value={crm.endpoint} onChange={(e) => setCrm({ ...crm, endpoint: e.target.value })} /><input required placeholder="Secret (shown once)" value={crm.secret} onChange={(e) => setCrm({ ...crm, secret: e.target.value })} /><button type="submit">Create disabled connection</button></form>{connections.length === 0 ? <p>No CRM connections configured.</p> : connections.map((connection) => <article key={connection.id}>{connection.name} — {connection.provider} — {connection.is_active ? "Enabled" : "Disabled"}</article>)}</section>
  </main>;
}
