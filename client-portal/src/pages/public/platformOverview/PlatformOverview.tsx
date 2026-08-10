import { Link } from "react-router-dom";
import "./platformOverview.scss";

export default function PlatformOverview() {
  return <main className="platform-overview" aria-labelledby="platform-overview-title">
    <p className="platform-overview__eyebrow">Beyvra demo workspace</p>
    <h1 id="platform-overview-title">Practice with clear, simulated controls.</h1>
    <p className="platform-overview__lead">Explore the chart workspace, asset list, demo order ticket, trade history and learning tools before entering the platform.</p>
    <div className="platform-overview__actions"><Link className="platform-overview__primary" to="/signIn?tab=registration&mode=demo">Try the demo</Link><Link className="platform-overview__secondary" to="/login">Sign in</Link></div>
    <section className="platform-overview__grid" aria-label="Demo workspace features">
      <article><h2>Chart workspace</h2><p>Review supported demo market views with explicit delayed or unavailable states.</p></article>
      <article><h2>Demo order ticket</h2><p>Set an amount and duration, then receive a server-confirmed simulated receipt.</p></article>
      <article><h2>Learn and review</h2><p>Use contextual guidance and a clear history of simulated activity.</p></article>
    </section>
    <p className="platform-overview__disclosure">Demo only. No deposits, withdrawals, or live orders are available in staging.</p>
  </main>;
}
