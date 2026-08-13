import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

import "./landing.scss";
import Herosection from "./herosection"
import Navbar from '../home/commonComponents/navbar/Navbar';
import DemoHighlights from './demoHighlights';


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
      <Navbar/>
      <Herosection />
      <DemoHighlights />
      <footer className="demoFooter">
        <p>{t("demoFooterDisclosure")}</p>
        <nav aria-label="Legal">
          <a href="/privacy">{t("privacy")}</a>
          <a href="/terms">{t("terms")}</a>
        </nav>
      </footer>
    </div>
  );
};


export default LandingPage;
