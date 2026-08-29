import { Link } from "react-router-dom";

import "../admin/portalShell.scss";

const contractorLinks = [
  { label: "Assigned Work", to: "/contractor/work" },
  { label: "Customer Queue", to: "/contractor/customers" },
  { label: "Status Updates", to: "/contractor/status" },
  { label: "Help", to: "/platform/help" },
];

export default function ContractorPortal() {
  return (
    <main className="portal-shell">
      <header className="portal-shell__header">
        <div>
          <p className="portal-shell__eyebrow">Beyvra Contractor</p>
          <h1>Work Queue</h1>
        </div>
        <Link className="portal-shell__button" to="/platform">Client View</Link>
      </header>
      <section className="portal-shell__grid" aria-label="Contractor workspaces">
        {contractorLinks.map((item) => (
          <Link className="portal-shell__tile" key={item.to} to={item.to}>
            <span>{item.label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
