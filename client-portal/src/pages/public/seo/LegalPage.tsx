import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import SeoHead from "./SeoHead";
import "./seo.scss";

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    description: "How Beyvra handles account, form, analytics, advertising, and security data.",
    body: [
      ["Information We Collect", "Beyvra may collect account details, contact form submissions, device and security signals, cookie preferences, and usage events needed to operate and improve the service."],
      ["Google And Third Parties", "If Google advertising or analytics tags are enabled, Google and its partners may use cookies or similar technologies after consent where required. Users can manage ad personalization through Google controls and Beyvra cookie settings."],
      ["Security", "Authentication uses backend-owned session boundaries. Production identity, registration, email verification, and password reset are owned by the configured identity provider."],
      ["Choices", "Visitors can reject optional analytics and advertising cookies, update preferences from the privacy control, and contact Beyvra about data requests."],
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description: "Beyvra cookie categories, consent choices, and Google consent-mode behavior.",
    body: [
      ["Required Cookies", "Required cookies support security, session integrity, fraud prevention, language preferences, and form reliability."],
      ["Analytics Cookies", "Analytics cookies help Beyvra understand page performance and product interest. They are optional and controlled by visitor consent."],
      ["Advertising Cookies", "Advertising cookies may support Google ads measurement or personalization only when enabled and consented where required."],
      ["Change Preferences", "Use the Privacy button on the site to update optional cookie settings at any time."],
    ],
  },
  terms: {
    title: "Terms Of Use",
    description: "Beyvra terms for demo trading, account access, acceptable use, and platform limitations.",
    body: [
      ["Demo Platform", "Beyvra public workflows are educational and demo-oriented unless a separate production-approved service explicitly states otherwise."],
      ["No Advice", "Content, tools, market data, and forms are not individualized investment, legal, tax, or financial advice."],
      ["Acceptable Use", "Users must not abuse forms, attempt unauthorized access, scrape private data, or interfere with platform security."],
      ["Changes", "Beyvra may update these terms as the platform evolves."],
    ],
  },
  "demo-disclosure": {
    title: "Demo And Risk Disclosure",
    description: "Important Beyvra disclosure for virtual funds, simulated trading, market risk, and educational content.",
    body: [
      ["Virtual Funds", "Demo balances are not cash, deposits, or withdrawable value."],
      ["Market Risk", "Markets can move against any position. Past performance does not predict future results."],
      ["Simulation Limits", "Simulated fills, spreads, liquidity, slippage, latency, and order behavior may differ from live markets."],
      ["User Responsibility", "Users should make independent decisions and consider professional advice before using real capital anywhere."],
    ],
  },
  accessibility: {
    title: "Accessibility",
    description: "Beyvra accessibility commitments for public pages, forms, navigation, and readable content.",
    body: [
      ["Commitment", "Beyvra aims to provide readable, keyboard-accessible, responsive public pages and forms."],
      ["Feedback", "Visitors can report accessibility barriers through the contact form."],
      ["Ongoing Work", "The platform will continue improving focus states, semantic markup, and screen-reader support."],
    ],
  },
};

export default function LegalPage() {
  const location = useLocation();
  const page = location.pathname.replace(/^\//, "") || "privacy";
  const content = legalPages[page as keyof typeof legalPages];
  if (!content) return <Navigate to="/privacy" replace />;

  return (
    <main className="legalPage">
      <SeoHead title={content.title} description={content.description} canonicalPath={`/${page}`} />
      <Navbar />
      <section className="legalHero">
        <span>Beyvra policy</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </section>
      <section className="legalBody">
        {content.body.map(([heading, body]) => (
          <article key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </article>
        ))}
        <nav aria-label="Legal pages">
          <Link to="/privacy">Privacy</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/demo-disclosure">Demo disclosure</Link>
          <Link to="/accessibility">Accessibility</Link>
        </nav>
      </section>
    </main>
  );
}
