import Slider from 'react-slick'
import { ArrowLeftOS, ArrowRightOS } from 'assets/icons';

import './aboutUsSlider.scss'

import RightQuoteIcon from '../../../../../assets/home/quoteRight.png'
import LeftQuoteIcon from '../../../../../assets/home/quoteLeft.png'
import RatingStarIcon from '../../../../../assets/home/ratingStar.png'
import { useTranslation } from 'react-i18next';

const AboutUsSlider = () => {
  const ArrowButtonPrevious:React.FC<{onClick: any}> = ({  onClick }) => {
    return (
      <button
        onClick={onClick}
        className="aboutUsPreviousSliderButton"
      >
        <div className='aboutPreviousSliderIconContainer'>
            <ArrowLeftOS/>
            
        </div>
      </button>
    );
  };
const ArrowButtonNext:React.FC<{onClick: any}>  = ({onClick }) => {
    return (
      <button
      className="aboutUsNextSliderButton"
        onClick={onClick}
      >
         <div className='aboutUsNextSliderIconContainer'>
         <ArrowRightOS  height='20' width='20'/>
        </div>
      </button>
    );
  };

  const settings_3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2.3,
    centerMode:true,
    
    slidesToScroll: 1,
    prevArrow: <ArrowButtonPrevious onClick={onclick}  />,
    nextArrow: <ArrowButtonNext  onClick={onclick}/>,
    responsive: [{
      breakpoint: 600,
      settings: {
        dots: true,
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll:1,
        arrows:false,
        
      }
    }]
  }

  const {t} = useTranslation()
  return (
    <div className='aboutUsSliderContainer'>
      <h2>{t("whatTradersSaysAboutUs")}</h2>
      <div className="aboutUsSliders">

                      
            <Slider {...settings_3}>
            <div className='aboutUsliderItem'>
                <div className='aboutUsSliderInnerItem'>
                  <div className='aboutUsSliderQuoteContainer'>
                    <div className='aboutUsUpperQuoteImage'>
                      <img src={RightQuoteIcon} alt="" />
                    </div>
                   <p>I was completely new to trading, and Tradex made it easy to learn the ropes. The educational resources were fantastic, and the user interface is so intuitive. </p>
                    <div className='aboutUsLowerQuoteImage'>
                      <img src={LeftQuoteIcon} alt="" />
                    </div>
                  </div>
                  <div className='aboutUsSliderCardInfo'>
                    <span>Sarah</span>
                    <div className='aboutUsRatingStarCard'>
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                    </div>
                  </div>
                </div>
            </div>
          
            <div className='aboutUsliderItem'>
                <div className='aboutUsSliderInnerItem'>
                  <div className='aboutUsSliderQuoteContainer'>
                    <div className='aboutUsUpperQuoteImage'>
                      <img src={RightQuoteIcon} alt="" />
                    </div>
                   <p>I was completely new to trading, and Tradex made it easy to learn the ropes. The educational resources were fantastic, and the user interface is so intuitive. </p>
                    <div className='aboutUsLowerQuoteImage'>
                      <img src={LeftQuoteIcon} alt="" />
                    </div>
                  </div>
                  <div className='aboutUsSliderCardInfo'>
                    <span>Sarah</span>
                    <div className='aboutUsRatingStarCard'>
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                    </div>
                  </div>
                </div>
            </div>
          
            <div className='aboutUsliderItem'>
                <div className='aboutUsSliderInnerItem'>
                  <div className='aboutUsSliderQuoteContainer'>
                    <div className='aboutUsUpperQuoteImage'>
                      <img src={RightQuoteIcon} alt="" />
                    </div>
                   <p>I was completely new to trading, and Tradex made it easy to learn the ropes. The educational resources were fantastic, and the user interface is so intuitive. </p>
                    <div className='aboutUsLowerQuoteImage'>
                      <img src={LeftQuoteIcon} alt="" />
                    </div>
                  </div>
                  <div className='aboutUsSliderCardInfo'>
                    <span>Sarah</span>
                    <div className='aboutUsRatingStarCard'>
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                      <img src={RatingStarIcon} alt="" />
                    </div>
                  </div>
                </div>
            </div>
            </Slider>
                </div>
    </div>
  )
}

export default AboutUsSlider