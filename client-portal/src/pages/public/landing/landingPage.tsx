import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

import "./landing.scss";
import Herosection from "./herosection"
import Review from "./review"
import Footer from "./footer"
import Aboutus from "./aboutus"
import Navbar from '../home/commonComponents/navbar/Navbar';
import Discover from './discover';
import Explore from './explore';
import Onyourway from './onyourway';
import Withdrawcard from './withdrawcard';
import Maingraph from './maingraph';


const LandingPage = () => {

  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);
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
      <Maingraph />
      <Aboutus />
      <Discover />
      <Withdrawcard />
      <Explore />
      <Onyourway />
      <Review />
      <Footer />
    </div>
  );
};


export default LandingPage;
