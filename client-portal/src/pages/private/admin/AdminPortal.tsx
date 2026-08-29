import { Link } from "react-router-dom";

import "./portalShell.scss";

const adminLinks = [
  { label: "Users", to: "/admin/users" },
  { label: "Compliance", to: "/admin/compliance" },
  { label: "Integrations", to: "/admin/integrations" },
  { label: "System", to: "/admin/system" },
  { label: "Audit", to: "/admin/audit" },
];

export default function AdminPortal() {
  return (
    <main className="portal-shell">
      <header className="portal-shell__header">
        <div>
          <p className="portal-shell__eyebrow">Beyvra Admin</p>
          <h1>Operations Console</h1>
        </div>
        <Link className="portal-shell__button" to="/platform">Client View</Link>
      </header>
      <section className="portal-shell__grid" aria-label="Admin workspaces">
        {adminLinks.map((item) => (
          <Link className="portal-shell__tile" key={item.to} to={item.to}>
            <span>{item.label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
