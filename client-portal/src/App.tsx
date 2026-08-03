import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import RequireAuth from "components/requireAuth";
import useInitializeData from "hooks/useInitializeData";

import PrivateRoute from "utils/ProtectedRoute ";
import Platform from "pages/private/platform/Platform";
import Loading from "components/loading";
import NotFoundPage from "pages/private/platform/platformMenus/notFound/NotFoundPage";
import PlatformOverview from "pages/public/platformOverview/PlatformOverview";
import ContentReview from "pages/public/contentReview/ContentReview";
import TradingConditions from "pages/public/trading/TradingConditions/Index";
import ForexProfitCalculator from "pages/public/trading/ForexProfitCalculator";
import KYC from "pages/private/platform/kyc";
import LocaleMetadata from "components/LocaleMetadata";
import { applyGeoLocaleHint } from "./i18n/geoLocale";

const DisabledFeatureRoute = () => <Navigate to="/" replace />;

const Commodities = lazy(() => import("pages/public/markets/commodities/Commodities"))
const Crypto = lazy(() => import("pages/public/markets/crypto/Crypto"))
const Etf = lazy(() => import("pages/public/markets/etf/Etf"))
const Bonds = lazy(() => import("pages/public/markets/bonds/Bonds"))
const Indices = lazy(() => import("pages/public/markets/indices/Indices"))
const Shares = lazy(() => import("pages/public/markets/shares/Shares"))
const Ipo = lazy(() => import("pages/public/markets/ipo/Ipo"))

// Legacy live-trading marketing pages are quarantined from staging.
// Unsupported leveraged/live surfaces remain intentionally unavailable in staging.
const CommoditiesProfitCalculator = lazy(() => import("pages/public/trading/CommoditiesProfitCal/Index"))
const ForexMarginCalculator = lazy(() => import("pages/public/trading/forexMarginCalculator"))
const EconomicCalendar = lazy(() => import("pages/public/trading/economicCalendar/Index"))
const ExpirationDates = lazy(() => import("pages/public/trading/expirationDates/Index"))

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
const EmailVerification = lazy(() => import("pages/public/emailVerification/EmailVerification"));
const SessionExpired = lazy(() => import("pages/public/sessionExpired/SessionExpired"));
const Home = lazy(() => import("pages/public/home/main/Home"));
const StatusDetails = lazy(() => import("./pages/public/statusDetails/StatusDetails"));
const IntegrationsAdmin = lazy(() => import("./pages/private/integrations/IntegrationsAdmin"));

export const GlobalLoginMaxAge = 2629746;

const App: React.FunctionComponent = () => {
  const { i18n } = useTranslation();
  useInitializeData();

  useEffect(() => {
    void applyGeoLocaleHint(i18n);
    const storedScale = localStorage.getItem("scale");

    if (storedScale) {
      updateScale(parseFloat(storedScale ? storedScale : "1"));
    }
  }, [i18n]);

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
          <LocaleMetadata />
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/platform" element={<Platform />} />
              <Route path="/platform/assets" element={<Platform />} />
              <Route path="/platform/trades" element={<Platform />} />
              <Route path="/platform/trades/:tradeId" element={<Platform />} />
              <Route path="/platform/portfolio" element={<Platform />} />
              <Route path="/platform/analytics" element={<Platform />} />
              <Route path="/platform/learn" element={<Platform />} />
              <Route path="/platform/help" element={<Platform />} />
              <Route path="/platform/profile" element={<Platform />} />
              <Route path="/platform/settings" element={<Platform />} />
              <Route path="/platform/settings/security" element={<Platform />} />
              <Route path="/platform/settings/sessions" element={<Platform />} />
              <Route path="/home" element={<Platform />} />
              <Route path="/kyc-document" element={<KYC />} />
              <Route path="/welcome" element={<PrivateRoute />}>
                <Route path="/welcome" element={<Welcome />} />
              </Route>
              <Route path="transactions" element={<Transactions />} />
              <Route path="/lender" element={<Lender />} />
              <Route path="/statusDetails" element={<StatusDetails />} />
              <Route path="/walkThrough" element={<WalkThrough />} />
              <Route path="/admin/integrations" element={<IntegrationsAdmin />} />
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
            <Route path="/platform-overview" element={<PlatformOverview />} />
            <Route path="/trading/tradingPlatform" element={<ContentReview />} />
            <Route path="/trading/MobileTrading" element={<ContentReview />} />
            <Route path="/trading/metaTradingFour" element={<DisabledFeatureRoute />} />
            <Route path="/trading/metaTradingFive" element={<DisabledFeatureRoute />} />
            <Route path="/trading/copyTrading" element={<DisabledFeatureRoute />} />
            <Route path="/trading/cfdTradingCalculator" element={<DisabledFeatureRoute />} />
            <Route path="/trading/commoditesProfitCalculator" element={<CommoditiesProfitCalculator />} />
            <Route path="/trading/forexProfitCalculator" element={<ForexProfitCalculator />} />
            <Route path="/trading/forexMarginCalculator" element={<ForexMarginCalculator />} />
            <Route path="/trading/economicCalendar" element={<EconomicCalendar />} />
            <Route path="/trading/cfdAssetList" element={<DisabledFeatureRoute />} />
            <Route path="/trading/tradingConditions" element={<TradingConditions />} />
            <Route path="/trading/expirationDate" element={<ExpirationDates />} />
            <Route path="/trading/cfdTrading" element={<DisabledFeatureRoute />} />
            <Route path="/trading" element={<ContentReview />} />
            <Route path="/downloads" element={<Download />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignIn />} />
            <Route path="/password-reset" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<SignIn />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/logout" element={<SignIn />} />
            <Route path="/dashboard" element={<Navigate to="/platform" replace />} />
            <Route path="/terms" element={<ContentReview />} />
            <Route path="/privacy" element={<ContentReview />} />
            <Route path="/cookies" element={<ContentReview />} />
            <Route path="/demo-disclosure" element={<ContentReview />} />
            <Route path="/accessibility" element={<ContentReview />} />
            <Route path="*" element={<NotFoundPage />} />
            
            
            <Route path="/welcomeSteps" element={<WelcomeSteps />} /> 
            <Route path="/prv" element={<Navigate to="/privacy" replace />} />
            <Route path="/reg" element={<Navigate to="/terms" replace />} />

          </Routes>
        </Router>
      </Suspense>
    </div>
  );
};

export default App;
