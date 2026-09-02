import { Link } from "react-router-dom";
import {
  BEYVRA_DOMAINS,
  CODESTRA_PRODUCT_NETWORK,
} from "../../../../../config/portfolio";

const year = new Date().getFullYear();

const Footer = () => (
  <footer className="hz-site-footer">
    <div className="hz-container hz-site-footer__grid">
      <section className="hz-site-footer__intro" aria-labelledby="beyvra-footer-title">
        <Link className="hz-brand" to="/" aria-label="Beyvra home">
          <img src="/logo.svg" alt="Beyvra" />
          <span className="hz-brand__domain">beyvra.com</span>
        </Link>
        <p className="hz-eyebrow">Codestra product network</p>
        <h2 id="beyvra-footer-title" className="hz-site-footer__title">
          Market exploration and demo trading with visible boundaries.
        </h2>
        <p>
          Beyvra keeps virtual funds, data freshness, capability state, order previews,
          and unsupported live-trading surfaces explicit.
        </p>
        <div className="hz-domain-list" aria-label="Beyvra domains">
          <a className="hz-domain-chip" href={BEYVRA_DOMAINS.public}>beyvra.com</a>
          <a className="hz-domain-chip" href={BEYVRA_DOMAINS.platform}>platform.beyvra.com</a>
          <a className="hz-domain-chip" href={BEYVRA_DOMAINS.administration}>admin.beyvra.com</a>
          <a className="hz-domain-chip" href={BEYVRA_DOMAINS.api}>api.beyvra.com</a>
        </div>
      </section>

      <nav aria-label="Beyvra markets">
        <h3 className="hz-site-footer__heading">Markets</h3>
        <ul className="hz-site-footer__links">
          <li><Link className="hz-site-footer__link" to="/markets/Commodities">Commodities</Link></li>
          <li><Link className="hz-site-footer__link" to="/markets/shares">Shares</Link></li>
          <li><Link className="hz-site-footer__link" to="/markets/indices">Indices</Link></li>
          <li><Link className="hz-site-footer__link" to="/markets/etfs">ETFs</Link></li>
          <li><Link className="hz-site-footer__link" to="/markets/bonds">Bonds</Link></li>
          <li><Link className="hz-site-footer__link" to="/markets/crypto">Crypto</Link></li>
        </ul>
      </nav>

      <nav aria-label="Beyvra platform">
        <h3 className="hz-site-footer__heading">Platform</h3>
        <ul className="hz-site-footer__links">
          <li><Link className="hz-site-footer__link" to="/platform-overview">Platform overview</Link></li>
          <li><Link className="hz-site-footer__link" to="/trading/tradingPlatform">Trading workspace</Link></li>
          <li><Link className="hz-site-footer__link" to="/trading/economicCalendar">Economic calendar</Link></li>
          <li><Link className="hz-site-footer__link" to="/trading/tradingConditions">Trading conditions</Link></li>
          <li><Link className="hz-site-footer__link" to="/downloads">Downloads</Link></li>
        </ul>
      </nav>

      <nav aria-label="Beyvra trust and legal">
        <h3 className="hz-site-footer__heading">Trust</h3>
        <ul className="hz-site-footer__links">
          <li><Link className="hz-site-footer__link" to="/demo-disclosure">Demo disclosure</Link></li>
          <li><Link className="hz-site-footer__link" to="/privacy">Privacy</Link></li>
          <li><Link className="hz-site-footer__link" to="/terms">Terms</Link></li>
          <li><Link className="hz-site-footer__link" to="/cookies">Cookies</Link></li>
          <li><Link className="hz-site-footer__link" to="/accessibility">Accessibility</Link></li>
        </ul>
      </nav>

      <div className="hz-site-footer__bottom">
        <span>© {year} Beyvra. Demo funds have no monetary value.</span>
        <div className="hz-footer-legal" aria-label="Codestra products">
          {CODESTRA_PRODUCT_NETWORK.map((product) => (
            <a key={product.href} className="hz-site-footer__link" href={product.href}>
              {product.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
