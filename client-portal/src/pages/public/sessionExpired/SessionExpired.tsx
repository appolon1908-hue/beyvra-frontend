import { Link } from "react-router-dom";
import "./sessionExpired.scss";

const SessionExpired = () => (
  <main className="sessionExpired" aria-labelledby="session-expired-title">
    <section className="sessionExpiredCard">
      <p className="sessionExpiredEyebrow">Beyvra security</p>
      <h1 id="session-expired-title">Your session has expired</h1>
      <p>For your security, sign in again to return to the demo workspace.</p>
      <Link className="sessionExpiredAction" to="/signIn?tab=login">Sign in again</Link>
    </section>
  </main>
);

export default SessionExpired;
