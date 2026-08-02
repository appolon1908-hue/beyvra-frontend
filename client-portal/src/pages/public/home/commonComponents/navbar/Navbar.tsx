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
import { Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import i18n from "../../../../../i18n";
import { languages } from "../../../../../constants";
import { useCookies } from "react-cookie";


const Navbar= () => {
    const [ipAddress, setIpAddress] = useState('');
    const [geoInfo, setGeoInfo] = useState<{countryCode:string}>()
    const [loading, setLoading] = useState(false)
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

  const getVisitorIp = async()=>{
    // setLoading(true)
    try {
      const response = await fetch('https://api.ipify.org')
      const data   = await response.text()
      console.log(data);
      setIpAddress(data)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  const fetchIpInfo = async ()=>{
    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}`)
      const data = await response.json()
      setGeoInfo(data)
      // setLoading(false)
    } catch (error) {
      // setCountryCode('EN')
      console.log(error);
      // setLoading(false)
    }
  }
  useEffect(()=>{
    getVisitorIp()
  },[])

  useEffect(()=>{
    fetchIpInfo()
    if(geoInfo){
      console.log(geoInfo?.countryCode);
      // setCountryCode(geoInfo?.countryCode)
    }
    console.log(geoInfo);
  },[ipAddress])

  const [toggleLanguageSelector, setToggleLanguageSelector] = useState(false);
  const [toggleMobileNav, setToggleMobileNav] = useState(false);
  console.log(localFlagHandler(countryCode.toLocaleLowerCase()));
  console.log(countryCode.toLocaleLowerCase());
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


  useEffect(() => {
    const matchedLanguage = languages.find(language => language.value.toLowerCase() === countryCode.toLowerCase());
    
    if (matchedLanguage) {
      i18n.changeLanguage(matchedLanguage.languageKey);
    } else {
      setCountryCode('EN');
      i18n.changeLanguage('en');
    }
  }, [countryCode]);


  useEffect(() => {
    const browserLanguage = navigator.language;
    const matchedLanguage = languages.find(language => language.value.toLowerCase() === browserLanguage.toLocaleLowerCase());
    if (matchedLanguage) {
      i18n.changeLanguage(countryCode.toLocaleLowerCase());
    } else {
      setCountryCode('EN')
      i18n.changeLanguage("en");
    }
  }, [])

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
          {loading ? (
            <div style={{ marginRight: "10px" }}>
              <Spin />
            </div>
          ) : (
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
          )}

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
                setCountryCode("en");
                setCookie('language', "en", { path: '/' });
                setToggleLanguageSelector(false);
              }}
            >
              <img src={localFlagHandler("en")} alt="" />
              <h2>English</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                setCountryCode("es");
                setCookie('language', "es", { path: '/' });

                setToggleLanguageSelector(false);
              }}
            >
              <img src={localFlagHandler("es")} alt="" />
              <h2>Spanish</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                setCountryCode("jp");
                setCookie('language', "jp", { path: '/' });

                setToggleLanguageSelector(false);
              }}
            >
              <img src={localFlagHandler("jp")} alt="" />
              <h2>Japanese</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                setCountryCode("AR");
                setCookie('language', "AR", { path: '/' });

                setToggleLanguageSelector(false);
              }}
            >
              <img src={localFlagHandler("ar")} alt="" />
              <h2>Arabic</h2>
            </div>
            <div
              className="languageValue"
              onClick={() => {
                setCountryCode("HI");
                setCookie('language', "HI", { path: '/' });

                setToggleLanguageSelector(false);
              }}
            >
              <img src={localFlagHandler("hi")} alt="" />
              <h2>India</h2>
            </div>
          </div>
        </div>
        <button
          className="primaryButton"
          onClick={() => {
            // dispatch(setSignInTab('1'))
            navigate("/");
          }}
        >
          Registration
        </button>
        
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
              <button
                className="primaryButton"
                onClick={() => {
                  // dispatch(setSignInTab('1'))
                  navigate("/signIn");
                  setToggleMobileNav(false);
                }}
              >
                Login
              </button>
              <button
                className="secondaryButton"
                onClick={() => {
                  // dispatch(setSignInTab('2'))
                  navigate("/signIn");
                  setToggleMobileNav(false);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
