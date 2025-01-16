import Slider from 'react-slick'
import './onePlatformSlider.scss'
import {  ArrowLeftOS, ArrowRightOS } from 'assets/icons';

import Forex from '../../../../../assets/onePlatformSlider/forex.png'
import Bonds from '../../../../../assets/onePlatformSlider/bonds.png'
import Commodities from '../../../../../assets/onePlatformSlider/commodites.png'
import Crypto from '../../../../../assets/onePlatformSlider/crypto.png'
import Indices from '../../../../../assets/onePlatformSlider/inidces.png'
import Ipo from '../../../../../assets/onePlatformSlider/ipo.png'
import Stocks from '../../../../../assets/onePlatformSlider/stocks.png'
import React, { useTransition } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OnePlatformSlider = () => {

  const ArrowButtonPrevious:React.FC<{onClick: any}> = ({  onClick }) => {
    return (
      <button
        onClick={onClick}
        className="platformPreviousSliderButton"
      >
        <div className='platformPreviousSliderIconContainer'>
            <ArrowLeftOS/>
            
        </div>
      </button>
    );
  };
const ArrowButtonNext:React.FC<{onClick: any}>  = ({onClick }) => {
    return (
      <button
      className="platformNextSliderButton"
        onClick={onClick}
      >
         <div className='platformNextSliderIconContainer'>
         <ArrowRightOS />
        </div>
      </button>
    );
  };

  const settings_3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <ArrowButtonPrevious onClick={onclick}  />,
    nextArrow: <ArrowButtonNext  onClick={onclick}/>,
    responsive: [{
      breakpoint: 600,
      settings: {
        dots: true,
        slidesToShow: 1,
        slidesToScroll:1,
        arrows:false,
        
      }
    }]
  };

  const {t} = useTranslation()
  return (
    <div className='onePlatformSliderContainer'>
      <h2>{t('onePlatformEndlesOptions')}</h2>
      {/* slider */}
      <div className="onePlatformSliders">

          
            <Slider {...settings_3}>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("forex")}</h2>
                  <img src={Forex} alt="Forex" />
                  <button>More Info</button>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("stocks")}</h2>
                  <img src={Stocks} alt="Forex" />
                  <button>More Info</button>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("commodities")}</h2>
                  <img src={Commodities} alt="Forex" />
                  <Link to={'/markets/Commodities'}>
                  <button>More Info</button>
                  </Link>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("indices")}</h2>
                  <img src={Indices} alt="Forex" />
                  <Link to={"/markets/indices"}>
                  <button>More Info</button>
                  </Link>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("crypto")}</h2>
                  <img src={Crypto} alt="Forex" />
                  <Link to={"/markets/crypto"}>
                  <button>More Info</button>
                  </Link>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t("ipos")}</h2>
                  <img src={Ipo} alt="Forex" />
                  <Link to={'/markets/ipos'}>
                  <button>More Info</button>
                  </Link>
                </div>
            </div>
            <div className='onePlatformSliderItem'>
                <div className='onePlatformSliderInnerItem'>
                  <h2>{t('bonds')}</h2>
                  <img src={Bonds} alt="Forex" />
                  <Link to={'/markets/bonds'}>
                  <button>More Info</button>
                  </Link>
                </div>
            </div>
                
            </Slider>
                </div>
      </div>
  )
}

export default OnePlatformSlider