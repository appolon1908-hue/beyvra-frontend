import { useEffect, useState } from 'react'

import './home.scss'
import Landing from './landing/Landing';
import CheckCurrency from './checkCurrency/CheckCurrency';
import LeadPlatform from './leadPlatform/LeadPlatform';
import OnePlatformOptions from './onePlatformOptions/OnePlatformOptions';
import OnePlatformSlider from './onePlatformSlider/OnePlatformSlider';
import AboutUsSlider from './aboutUs/AboutUsSlider';
import ExecutiveBonuses from './executiveBounuses/ExecutiveBonuses';
import Footer from './footer/Footer';
import Navbar from '../commonComponents/navbar/Navbar';



const Home = () => {

  return (
    <div className='homeContainer'>
      <Navbar/>
        <Landing/>
        <CheckCurrency/>
        <LeadPlatform/>
        <OnePlatformOptions/>
        <OnePlatformSlider/>
        <AboutUsSlider />
        <ExecutiveBonuses />
        <Footer/>
    </div>
  )
}

export default Home