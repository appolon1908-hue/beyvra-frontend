import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import RequireAuth from "components/requireAuth";
import useInitializeData from "hooks/useInitializeData";

import PrivateRoute from "utils/ProtectedRoute ";
import Platform from "pages/private/platform/Platform";
import Loading from "components/loading";
import NotFoundPage from "pages/private/platform/platformMenus/notFound/NotFoundPage";
import Trading from "pages/public/trading/Trading";
import TradingConditions from "pages/public/trading/TradingConditions/Index";
import CFDTrading from "pages/public/trading/cfdTrading";
import ForexProfitCalculator from "pages/public/trading/ForexProfitCalculator";
import KYC from "pages/private/platform/kyc";
import { languages } from "./constants";

const Commodities = lazy(() => import("pages/public/markets/commodities/Commodities"))
const Crypto = lazy(() => import("pages/public/markets/crypto/Crypto"))
const Etf = lazy(() => import("pages/public/markets/etf/Etf"))
const Bonds = lazy(() => import("pages/public/markets/bonds/Bonds"))
const Indices = lazy(() => import("pages/public/markets/indices/Indices"))
const Shares = lazy(() => import("pages/public/markets/shares/Shares"))
const Ipo = lazy(() => import("pages/public/markets/ipo/Ipo"))

const TradingPlatform = lazy(() => import("pages/public/trading/platform"))
const MobileTrading = lazy(() => import("pages/public/trading/tradingMobile"))
const MetaTradingFour = lazy(() => import("pages/public/trading/metaTrading4/Index"))
const MetaTradingFive = lazy(() => import("pages/public/trading/metaTrading5"))
const CopyTrading = lazy(() => import("pages/public/trading/CopyTrade"))
const CFDTradingCalculator = lazy(() => import("pages/public/trading/CFDCalculator"))
const CommoditiesProfitCalculator = lazy(() => import("pages/public/trading/CommoditiesProfitCal/Index"))
const ForexMarginCalculator = lazy(() => import("pages/public/trading/forexMarginCalculator"))
const EconomicCalendar = lazy(() => import("pages/public/trading/economicCalendar/Index"))
const CFDAssetList = lazy(() => import("pages/public/trading/CFDAssetList/Index"))
const ExpirationDates = lazy(() => import("pages/public/trading/expirationDates/Index"))
const Prv = lazy(() => import("pages/public/home/privacyPolicy/PrivacyPolicy"))
const Reg = lazy(() => import("pages/public/home/regulation/Regulation"))

// Lazy load components
const Lender = lazy(() => import("./pages/private/lender/Lender"));
const SignIn = lazy(() => import("./pages/public/signIn/SignIn"));

// added by me for test
const WalkThrough = lazy(() => import("./pages/public/signIn/components/WalkThrough")); 
const WelcomeSteps = lazy(() => import("./pages/private/welcomeSteps/steps/WelcomeSteps"));



const Welcome = lazy(() => import("./pages/public/welcome/Welcome"));
const LandingPage = lazy(() => import("./pages/public/landing/landingPage"));
const Download = lazy(() => import("./pages/public/downloads/Download"));
const Transactions = lazy(() => import("./pages/private/transactions/Transactions"));
const ResetPassword = lazy(() => import("pages/public/resetPassword/ResetPassword"));
const Home = lazy(() => import("pages/public/home/main/Home"));
const StatusDetails = lazy(() => import("./pages/public/statusDetails/StatusDetails"));

export const GlobalLoginMaxAge = 2629746;

const App: React.FunctionComponent = () => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  useInitializeData();

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const localLang = data.languages.split(',')[0];
        const lang = localLang.split('-');
        const matchedLanguage = languages.find(language => language.value.toLowerCase() === lang[0].toLowerCase());
        if (matchedLanguage) {
          i18n.changeLanguage(matchedLanguage?.languageKey);
        } else {
          i18n.changeLanguage('en');
        }
      });
    const storedScale = localStorage.getItem("scale");

    if (storedScale) {
      updateScale(parseFloat(storedScale ? storedScale : "1"));
    }
  }, []);

  const updateScale = (scale: number) => {
    const root = document.documentElement;
    root.style.fontSize = `${scale}rem`;
    localStorage.setItem("scale", scale.toString());
  };

  // ADDED BY ME



  return (
    <div data-theme={"dark"} style={{ backgroundColor: '#000000' }}>
      <Suspense fallback={<div className="fullLoadingBackground"><Loading /></div>}>
        <Router>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/platform" element={<Platform />} />
              <Route path="/home" element={<Platform />} />
              <Route path="/kyc-document" element={<KYC />} />
              <Route path="/welcome" element={<PrivateRoute />}>
                <Route path="/welcome" element={<Welcome />} />
              </Route>
              <Route path="transactions" element={<Transactions />} />
              <Route path="/lender" element={<Lender />} />
              <Route path="/statusDetails" element={<StatusDetails />} />
              <Route path="/walkThrough" element={<WalkThrough />} />
            </Route>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/markets/Commodities" element={<Commodities />} />
            <Route path="/markets/shares" element={<Shares />} />
            <Route path="/markets/indices" element={<Indices />} />
            <Route path="/markets/etfs" element={<Etf />} />
            <Route path="/markets/bonds" element={<Bonds />} />
            <Route path="/markets/ipos" element={<Ipo />} />
            <Route path="/markets/crypto" element={<Crypto />} />
            <Route path="/trading/tradingPlatform" element={<TradingPlatform />} />
            <Route path="/trading/MobileTrading" element={<MobileTrading />} />
            <Route path="/trading/metaTradingFour" element={<MetaTradingFour />} />
            <Route path="/trading/metaTradingFive" element={<MetaTradingFive />} />
            <Route path="/trading/copyTrading" element={<CopyTrading />} />
            <Route path="/trading/cfdTradingCalculator" element={<CFDTradingCalculator />} />
            <Route path="/trading/commoditesProfitCalculator" element={<CommoditiesProfitCalculator />} />
            <Route path="/trading/forexProfitCalculator" element={<ForexProfitCalculator />} />
            <Route path="/trading/forexMarginCalculator" element={<ForexMarginCalculator />} />
            <Route path="/trading/economicCalendar" element={<EconomicCalendar />} />
            <Route path="/trading/cfdAssetList" element={<CFDAssetList />} />
            <Route path="/trading/tradingConditions" element={<TradingConditions />} />
            <Route path="/trading/expirationDate" element={<ExpirationDates />} />
            <Route path="/trading/cfdTrading" element={<CFDTrading />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/downloads" element={<Download />} />
            <Route path="/signIn" element={<LandingPage />} />
            <Route path="/password-reset" element={<ResetPassword />} />
            <Route path="*" element={<NotFoundPage />} />
            
            
            <Route path="/welcomeSteps" element={<WelcomeSteps />} /> 
            <Route path="/prv" element={<Prv />} /> 
            <Route path="/reg" element={<Reg />} /> 

          </Routes>
        </Router>
      </Suspense>
    </div>
  );
};

export default App;
