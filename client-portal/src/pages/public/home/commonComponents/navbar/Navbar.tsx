import "./navbar.scss";
import TradxLogo from "../../../../../assets/home/tradxlogo.png";

import {
  ArrowDownOS,
  MenuBar,
  MenuCloseIcon,
  SearchIcon,
} from "assets/icons";
import { useEffect, useRef, useState } from "react";
import { localFlagHandler } from "i18n/helpers";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../../../i18n";
import { useCookies } from "react-cookie";


const Navbar= () => {
    const [activeMobileMenu, setActiveMobileMenu] = useState(null);
    const [cookies, setCookie] = useCookies(['language']);
  
    const [countryCode, setCountryCode] = useState(() => {
      // Check if there's a language cookie, otherwise use i18n.language or default to 'EN'
      return cookies.language || (i18n.language ? i18n.language.toUpperCase() : 'EN');
    });
    
    const toggleMenu = (menu:any) => {
      
      setActiveMobileMenu(activeMobileMenu === menu ? null : menu);
    };

  const navigate = useNavigate();

  const [toggleLanguageSelector, setToggleLanguageSelector] = useState(false);
  const [toggleMobileNav, setToggleMobileNav] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: globalThis.MouseEvent) => {
    if (
      languageSelectorRef.current &&
      !languageSelectorRef.current.contains(event.target as Node)
    ) {
      setToggleLanguageSelector(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectLanguage = (language: string) => {
    setCountryCode(language);
    setCookie("language", language, { path: "/" });
    void i18n.changeLanguage(language);
    setToggleLanguageSelector(false);
  };

  return (
    <div className="navbarContainer">
      {/* left side nav */}
      <div className="leftSideNav">
        <Link to="/">
          <img src={TradxLogo} alt="" />
        </Link>

        <div className="navContent">
          <div className="navDropDownContainer ">
            <span>Markets</span>
            <ArrowDownOS height="16" width="12" />
            <div className="navDropDownNav">
              <div className="leftNavDropDown">
                <Link to="/markets/Commodities">
                  <p>Commodities</p>
                </Link>
                <Link to="/markets/shares">
                  <p>Shares</p>
                </Link>
                <Link to="/markets/crypto">
                  <p>Crypto</p>
                </Link>
                <Link to="/markets/bonds">
                  <p>Bonds</p>
                </Link>
              </div>
              <div className="rightNavDropDown">
                <Link to="/markets/indices">
                  <p>Indices</p>
                </Link>
                <Link to="/markets/etfs">
                  <p>ETFs</p>
                </Link>
                <Link to="/markets/ipos">
                  <p>Ipos</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="navDropDownContainer ">
            <span>Trading</span>
            <ArrowDownOS height="16" width="12" />
            <div className="navDropDownNav">
              <div className="firstNavDropDown">
                <Link to="/trading/tradingPlatform">
                  <p>Trading Platform</p>
                </Link>
                <Link to="/trading/MobileTrading">
                  <p>Mobile Trading</p>
                </Link>
                <Link to="/trading/metaTradingFour">
                  <p>Meta Trader 4</p>
                </Link>
                <Link to="/trading/metaTradingFive">
                  <p>Meta Trader 5</p>
                </Link>
                <Link to="/trading/copyTrading">
                  <p>Copy Trading</p>
                </Link>
                <Link to="/trading/cfdTrading">
                  <p>CFD Trading</p>
                </Link>
              </div>
              <div className="secondNavDropDown">
                <Link to="/trading/cfdTradingCalculator">
                  <p>CFD Trading Calculator</p>
                </Link>
                <Link to="/trading/economicCalendar">
                  <p>Economic Calendar</p>
                </Link>
                <Link to="/trading/cfdAssetList">
                  <p>CFD Asset List</p>
                </Link>
                <Link to="/trading/tradingConditions">
                  <p>Trading Conditions</p>
                </Link>
                <Link to="/trading/expirationDate">
                  <p>Expiration Dates</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      {/* right side navbar */}
      <div className="rightSideNav">
    
        {/* language selector */}
        <div ref={languageSelectorRef} className="languageSelectorContainer">
            <div
              
              className="languageButton"
              onClick={() => setToggleLanguageSelector(!toggleLanguageSelector)}
            >
              <img
                src={localFlagHandler(countryCode.toLocaleLowerCase())}
                alt=""
              />
              <h2>{countryCode.toUpperCase()}</h2>
              <ArrowDownOS height="15" width="10" />
            </div>

          <div
            className={`languageDropDownMenu ${
              toggleLanguageSelector
                ? "showLanguageDropDown"
                : "closeLanguageDropDown"
            }`}
          >
            <div
              className="languageValue"
              onClick={() => {
                selectLanguage("en");
              }}
            >
              <img src={localFlagHandler("en")} alt="" />
              <h2>English</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                selectLanguage("es");
              }}
            >
              <img src={localFlagHandler("es")} alt="" />
              <h2>Spanish</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                selectLanguage("ja");
              }}
            >
              <img src={localFlagHandler("ja")} alt="" />
              <h2>Japanese</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                selectLanguage("ar");
              }}
            >
              <img src={localFlagHandler("ar")} alt="" />
              <h2>Arabic</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                selectLanguage("hi");
              }}
            >
              <img src={localFlagHandler("hi")} alt="" />
              <h2>India</h2>
            </div>
          </div>
        </div>
        <Link
          className="primaryButton"
          to="/signIn?tab=registration"
        >
          Registration
        </Link>
        
      </div>
      <div className="menuBarButton" onClick={() => setToggleMobileNav(true)}>
        <MenuBar height="30px" width="30px" />
      </div>
      <div
        className={`${toggleMobileNav ? "mobileNavOpen" : "mobileNavClose"}`}
      >
        <div
          className="menuCloseIcon"
          onClick={() => setToggleMobileNav(false)}
        >
          <MenuCloseIcon />
        </div>
        <div className="mobileNavLogo">
          <img src={TradxLogo} alt="" />
        </div>

        <div className="mobileNavContent">
          {/* search */}
          <div className="navSearchMoblieContainer">
            <SearchIcon height="13" width="13" />
            <input id="search" name="search" type="text" placeholder="Search" />
          </div>
          <span>Markets</span>
          <span>Trading</span>
          {/* <span>Learn</span> */}
          <div className="mobileBottomNav">
            {/* language selector */}
            <div className="languageSelectorContainer">
              <div
                className="languageButton"
                onClick={() =>
                  setToggleLanguageSelector(!toggleLanguageSelector)
                }
              >
                <img src={localFlagHandler("en")} alt="" />
                <h2>En</h2>
                <ArrowDownOS height="15" width="10" />
              </div>
              <div
                className={`languageDropDownMenu ${
                  toggleLanguageSelector
                    ? "showLanguageDropDown"
                    : "closeLanguageDropDown"
                }`}
              >
                <div className="languageValue">
                  <img src={localFlagHandler("en")} alt="" />
                  <h2>English</h2>
                </div>
                <div className="languageValue">
                  <img src={localFlagHandler("es")} alt="" />
                  <h2>Spanich</h2>
                </div>
                <div className="languageValue">
                  <img src={localFlagHandler("ar")} alt="" />
                  <h2>Arabic</h2>
                </div>
                <div className="languageValue">
                  <img src={localFlagHandler("jp")} alt="" />
                  <h2>Japanese</h2>
                </div>
                <div className="languageValue">
                  <img src={localFlagHandler("hi")} alt="" />
                  <h2>Mandarin</h2>
                </div>
              </div>
            </div>
            <div>
              <Link
                className="primaryButton"
                to="/signIn?tab=login"
                onClick={() => setToggleMobileNav(false)}
              >
                Login
              </Link>
              <Link
                className="secondaryButton"
                to="/signIn?tab=registration"
                onClick={() => setToggleMobileNav(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
