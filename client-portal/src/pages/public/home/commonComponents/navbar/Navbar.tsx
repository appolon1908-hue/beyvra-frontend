import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import i18n from "../../../../../i18n";
import { BEYVRA_DOMAINS } from "../../../../../config/portfolio";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
] as const;

const navigation = [
  { label: "Markets", to: "/markets" },
  { label: "Trading", to: "/trading" },
  { label: "Platform", to: "/platform-overview" },
  { label: "Downloads", to: "/downloads" },
] as const;

const Navbar = () => {
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["language"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLanguage = String(
    cookies.language || i18n.language || "en",
  ).toLowerCase();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const selectLanguage = (language: string) => {
    setCookie("language", language, { path: "/", sameSite: "lax" });
    void i18n.changeLanguage(language);
  };

  return (
    <>
      <a className="hz-skip-link" href="#root">
        Skip to application
      </a>
      <header className="hz-site-header">
        <div className="hz-container hz-site-header__inner">
          <Link className="hz-brand" to="/" aria-label="Beyvra home">
            <img src="/logo.svg" alt="Beyvra" />
            <span className="hz-brand__domain">beyvra.com</span>
          </Link>

          <nav className="hz-site-nav hz-site-nav--desktop" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} className="hz-site-nav__link" to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hz-header-actions">
            <select
              className="hz-language-select"
              aria-label="Language"
              value={languages.some((item) => item.code === currentLanguage) ? currentLanguage : "en"}
              onChange={(event) => selectLanguage(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
            <Link className="hz-button hz-button--secondary hz-button--small" to="/signIn?tab=login">
              Sign in
            </Link>
            <Link className="hz-button hz-button--primary hz-button--small" to="/signIn?tab=registration&mode=demo">
              Try demo
            </Link>
            <button
              className="hz-button hz-button--secondary hz-menu-button"
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="beyvra-mobile-navigation"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        <div id="beyvra-mobile-navigation" className="hz-mobile-panel" data-open={mobileOpen}>
          <nav className="hz-container hz-mobile-panel__inner" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} className="hz-site-nav__link" to={item.to}>
                {item.label}
              </NavLink>
            ))}
            <a className="hz-site-nav__link" href={BEYVRA_DOMAINS.platform}>
              Platform domain
            </a>
            <Link className="hz-site-nav__link" to="/signIn?tab=login">
              Sign in
            </Link>
            <Link className="hz-button hz-button--primary" to="/signIn?tab=registration&mode=demo">
              Open demo account
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
