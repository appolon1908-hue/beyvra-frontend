import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

import "./portalShell.scss";

const adminLinks = [
  { label: "Users", to: "/admin/users" },
  { label: "Compliance", to: "/admin/compliance" },
  { label: "Integrations", to: "/admin/integrations" },
  { label: "System", to: "/admin/system" },
  { label: "Audit", to: "/admin/audit" },
];

type AdminPortalSummary = {
  users: {
    total: number;
    active: number;
    staff: number;
    admins: number;
    contractors: number;
    newToday: number;
  };
  compliance: {
    profiles: number;
    pendingProfiles: number;
    activeProfiles: number;
    openCases: number;
  };
  webhooks: {
    pending: number;
    processing: number;
    processed: number;
    deadLetter: number;
  };
  security: {
    openHighRiskEvents: number;
  };
  system: {
    state: string;
    realtimeV2Enabled: boolean;
    environment: string;
  };
  audit: {
    recent: Array<{
      auditId: string;
      action: string;
      target: string;
      role: string;
      actorEmail: string;
      timestamp: string;
    }>;
  };
};

const emptySummary: AdminPortalSummary = {
  users: { total: 0, active: 0, staff: 0, admins: 0, contractors: 0, newToday: 0 },
  compliance: { profiles: 0, pendingProfiles: 0, activeProfiles: 0, openCases: 0 },
  webhooks: { pending: 0, processing: 0, processed: 0, deadLetter: 0 },
  security: { openHighRiskEvents: 0 },
  system: { state: "UNKNOWN", realtimeV2Enabled: false, environment: "" },
  audit: { recent: [] },
};

function formatCount(value: number) {
  return new Intl.NumberFormat().format(value);
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function AdminPortal() {
  const [summary, setSummary] = useState<AdminPortalSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const payload = await authenticatedRequest<AdminPortalSummary>(apiEndpoints.adminPortal.summary);
        if (mounted) {
          setSummary(payload);
          setMessage("");
        }
      } catch (error) {
        logInternalError(error, { endpoint: apiEndpoints.adminPortal.summary });
        if (mounted) setMessage(toUserSafeErrorText(error, "admin"));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Users", value: summary.users.total, detail: `${formatCount(summary.users.active)} active` },
      { label: "Admins", value: summary.users.admins, detail: `${formatCount(summary.users.staff)} staff accounts` },
      { label: "Compliance", value: summary.compliance.openCases, detail: "open cases" },
      { label: "Webhooks", value: summary.webhooks.deadLetter, detail: "dead letter events" },
      { label: "Security", value: summary.security.openHighRiskEvents, detail: "open high risk events" },
      {
        label: "Realtime",
        value: summary.system.realtimeV2Enabled ? "V2" : "Off",
        detail: summary.system.state,
      },
    ],
    [summary],
  );

  return (
    <main className="portal-shell">
      <header className="portal-shell__header">
        <div>
          <p className="portal-shell__eyebrow">Beyvra Admin</p>
          <h1>Operations Console</h1>
          <p className="portal-shell__subline">
            {summary.system.environment || "Current"} environment / {summary.system.state}
          </p>
        </div>
        <Link className="portal-shell__button" to="/platform">Client View</Link>
      </header>

      {message ? <div className="portal-shell__notice" role="status">{message}</div> : null}

      <section className="portal-shell__metrics" aria-label="Admin summary">
        {metrics.map((item) => (
          <article className="portal-shell__metric" key={item.label} aria-busy={isLoading}>
            <span>{item.label}</span>
            <strong>{typeof item.value === "number" ? formatCount(item.value) : item.value}</strong>
            <small>{item.detail}</small>
          </article>
        ))}
      </section>

      <section className="portal-shell__grid" aria-label="Admin workspaces">
        {adminLinks.map((item) => (
          <Link className="portal-shell__tile" key={item.to} to={item.to}>
            <span>{item.label}</span>
          </Link>
        ))}
      </section>

      <section className="portal-shell__panel" aria-label="Recent audit activity">
        <div className="portal-shell__panel-heading">
          <h2>Recent Audit</h2>
          <Link to="/admin/audit">View All</Link>
        </div>
        {summary.audit.recent.length ? (
          <div className="portal-shell__activity">
            {summary.audit.recent.map((event) => (
              <div className="portal-shell__activity-row" key={event.auditId}>
                <div>
                  <strong>{event.action}</strong>
                  <span>{event.target}</span>
                </div>
                <div>
                  <span>{event.actorEmail || event.role || "System"}</span>
                  <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="portal-shell__empty">{isLoading ? "Loading audit activity..." : "No recent audit events."}</p>
        )}
      </section>
    </main>
  );
}
