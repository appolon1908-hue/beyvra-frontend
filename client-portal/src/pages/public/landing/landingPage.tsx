import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

import "./landing.scss";
import Herosection from "./herosection"
import Navbar from '../home/commonComponents/navbar/Navbar';
import DemoHighlights from './demoHighlights';
import SeoHead from "../seo/SeoHead";
import LeadForm from "../seo/LeadForm";
import { seoLandingPages } from "../seo/seoPages";


const LandingPage = () => {

  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);
  const { t } = useTranslation();
  const isAuthenticated = Boolean(cookies.access_token);
  const wasAuthenticatedOnMount = useRef(isAuthenticated);

  useEffect(() => {
    if (wasAuthenticatedOnMount.current) {
      navigate('/platform'); // Redirect to main page if authenticated
    }
  }, [navigate]);

  if (wasAuthenticatedOnMount.current) {
    return null;
  }



  return (
    <div className="landingPage">
      <SeoHead
        title="Beyvra Demo Trading Workspace"
        description="Beyvra is a demo trading workspace for market education, watchlists, charts, portfolio practice, and secure client access."
        canonicalPath="/"
        keywords="Beyvra, demo trading, paper trading, trading simulator, market education"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Beyvra",
          url: "https://beyvra.com",
          sameAs: [],
        }}
      />
      <Navbar/>
      <Herosection />
      <DemoHighlights />
      <section className="publicTopicIndex" aria-label="Beyvra topics">
        <div className="publicTopicIntro">
          <span>{t("publicMarketEducation")}</span>
          <h2>{t("publicExploreByGoal")}</h2>
          <p>{t("publicExploreByGoalBody")}</p>
        </div>
        <div className="publicTopicGrid">
          {seoLandingPages.map((page) => (
            <a href={`/learn/${page.slug}`} key={page.slug}>
              <strong>{page.title}</strong>
              <span>{page.description}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="publicLeadSection" aria-label="Beyvra client access form">
        <div>
          <span>{t("publicClientTracking")}</span>
          <h2>{t("publicLeadTitle")}</h2>
          <p>{t("publicLeadBody")}</p>
        </div>
        <LeadForm source="home" />
      </section>
      <footer className="demoFooter">
        <p>{t("demoFooterDisclosure")}</p>
        <nav aria-label="Legal">
          <a href="/privacy">{t("privacy")}</a>
          <a href="/terms">{t("terms")}</a>
          <a href="/cookies">{t("cookies")}</a>
          <a href="/demo-disclosure">{t("demoDisclosureLink")}</a>
          <a href="/accessibility">{t("accessibility")}</a>
        </nav>
      </footer>
    </div>
  );
};


export default LandingPage;
