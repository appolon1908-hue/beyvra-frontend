import "./landing.scss";
import hero2 from "../../../assets/hero2.png";
import { useNavigate } from "react-router-dom";


const Aboutus = () => {
    const navigate = useNavigate();
    const goToRoute = () => {
        navigate("/signIn"); // Replace with the route you want to navigate to
    };

  return (
    <div className="aboutusparent">

          <div className="upper">  
            <div>
                <h1> We Make Trading Simple  </h1>
            </div>
            <div className="upper-body">
                <div className="upperleft">
                    <div className="platform-screen">
                        <img className="about-img" src={hero2} alt="" />
                    </div>
                </div>
                <div className="upperright">

                    <ul className="main-info__list">
                        <li className="main-info__item">
                            <div className="before-element"></div>
                            <h3 className="main-info__item-title">Minimum Risk, Maximum Fun</h3>
                            <p className="main-info__item-text">
                                Try out new strategies and hone your skills with 10,000 in your demo account.
                            </p>
                        </li>
                        
                        <li className="main-info__item">
                            <h3 className="main-info__item-title">No Boring and Complicated Formulas</h3>
                            <p className="main-info__item-text">
                                Effective trade analytics are available from our experts.
                            </p>
                        </li>
                        
                        <li className="main-info__item">
                            <h3 className="main-info__item-title">At Any Time, on Any Device</h3>
                            <p className="main-info__item-text">
                                Trade on any convenient device at&nbsp;any&nbsp;time.
                            </p>
                        </li>
                    </ul>



                </div>
            </div>
          </div>


          <div className="middle">  
            <div className="fullwidth">
                <h1> Trade in a Mode That's Convenient for You  </h1>
            </div>
            <div className="middle-body">
                <div className="middleleft">
                    
                    <div className="content">
                        <img className="content__img" src="mode1.webp" alt="" />
                        
                        <div className="content__text">
                            <ul className="content__list">
                                <li className="content__item content__item-1">Quick-Open Trades</li>
                                <li className="content__item content__item-2">Fixed rate of return</li>
                            </ul>
                            
                            <button  className="button button--transparent js-scroll-link btn__ft regime-fixed-time-btn" onClick={goToRoute}>
                                Try Now
                            </button>
                        </div>

                    </div>


                </div>
                <div className="middleright">

                    <div className="content">
                        <img className="content__img" src="mode2.webp" alt="" />
                        
                        <div className="content__text">
                            <ul className="content__list">
                                <li className="content__item content__item-3">Transparent quotes</li>
                                <li className="content__item content__item-4">Extended trade settings</li>
                            </ul>

                            <button  className="button button--transparent js-scroll-link btn__ft regime-fixed-time-btn" onClick={goToRoute}>
                                Try Now
                            </button>
                        </div>

                    </div>

                </div>
            </div>
          </div>


          <div className="bottom">

            <div>
                <h1> Check Out How It Works </h1>
            </div>
            <div className="bottom-body">
                <ul className="list-svg-text">
                    <li className="list-svg-text__item">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="51.5" cy="51.5" r="1" fill="#6aff41" stroke="#6aff41"></circle>
                            <path d="M51.5 61C56.7467 61 61 56.7467 61 51.5C61 46.2533 56.7467 42 51.5 42C46.2533 42 42 46.2533 42 51.5C42 56.7467 46.2533 61 51.5 61Z" stroke="#6aff41" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"></path>
                            <path d="M49 41H54" stroke="#6aff41" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round"></path>
                            <path d="M65.0175 70H37.9825C35.2322 70 33 67.7678 33 65.0175V37.9825C33 35.2322 35.2322 33 37.9825 33H65.0175C67.7678 33 70 35.2322 70 37.9825V65.0175C70 67.7678 67.7678 70 65.0175 70Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M18 25.7213L23.3783 33L33.7895 18L39 25.7213" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M33 47H14.9825C12.2322 47 10 44.7678 10 42.0175V14.9825C10 12.2322 12.2322 10 14.9825 10H42.0175C44.7678 10 47 12.2322 47 14.9825V33" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>

                        <p className="list-svg-text__desc">
                            <span className="list-svg-text__item__title"> Set the Trading Mode </span> 
                            
                            FTT or FX. 
                        </p>

                    </li>
                    <li className="list-svg-text__item">

                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 49.8672V47.8672" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M40 31V29" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M44.2427 32.001H40.0197C40.0197 32.001 34.9327 32.001 35.0007 35.9317C35.0686 39.8625 40.0197 39.5594 40.0197 39.5594C40.0197 39.5594 45.029 39.4684 44.9999 43.3285C44.9707 47.1784 40.0197 47.1178 40.0197 47.1178H35.6705" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M40 16.3806C43.3137 16.3806 46 13.6091 46 10.1903C46 6.7715 43.3137 4 40 4C36.6863 4 34 6.7715 34 10.1903C34 13.6091 36.6863 16.3806 40 16.3806Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M40 22.0004V16.8418" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M40 76C43.3137 76 46 73.3137 46 70C46 66.6863 43.3137 64 40 64C36.6863 64 34 66.6863 34 70C34 73.3137 36.6863 76 40 76Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M40 58V63" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11.1938 47C14.6145 47 17.3875 44.3137 17.3875 41C17.3875 37.6863 14.6145 35 11.1938 35C7.77304 35 5 37.6863 5 41C5 44.3137 7.77304 47 11.1938 47Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M22.9998 41H17.8384" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M68.9544 47C72.2933 47 75 44.3137 75 41C75 37.6863 72.2933 35 68.9544 35C65.6154 35 62.9087 37.6863 62.9087 41C62.9087 44.3137 65.6154 47 68.9544 47Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M57 41H62.038" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M18.0266 25.0532C21.355 25.0532 24.0532 22.355 24.0532 19.0266C24.0532 15.6982 21.355 13 18.0266 13C14.6982 13 12 15.6982 12 19.0266C12 22.355 14.6982 25.0532 18.0266 25.0532Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M27.0002 28.0002L22.9824 23.9824" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M61.7714 68.9999C65.2113 68.9999 67.9999 66.2113 67.9999 62.7714C67.9999 59.3315 65.2113 56.543 61.7714 56.543C58.3315 56.543 55.543 59.3315 55.543 62.7714C55.543 66.2113 58.3315 68.9999 61.7714 68.9999Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M53 54L57.1523 58.1523" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M18.0266 68.9999C21.355 68.9999 24.0532 66.2113 24.0532 62.7714C24.0532 59.3315 21.355 56.543 18.0266 56.543C14.6982 56.543 12 59.3315 12 62.7714C12 66.2113 14.6982 68.9999 18.0266 68.9999Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M27.0002 54L22.9824 58.1523" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M61.7714 25.0532C65.2113 25.0532 67.9999 22.355 67.9999 19.0266C67.9999 15.6982 65.2113 13 61.7714 13C58.3315 13 55.543 15.6982 55.543 19.0266C55.543 22.355 58.3315 25.0532 61.7714 25.0532Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M53 28.0002L57.1523 23.9824" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                        </svg>

                        <p className="list-svg-text__desc">
                            <span className="list-svg-text__item__title"> Select an Asset </span> 
                            
                            Currencies, metals, ETF`s. 
                        </p>

                    </li>
                    <li className="list-svg-text__item">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.53554 50.5355C4.58291 48.5829 4.58291 45.4171 6.53553 43.4645L41.4645 8.53554C43.4171 6.58291 46.5829 6.58291 48.5355 8.53554L71.4645 31.4645C73.4171 33.4171 73.4171 36.5829 71.4645 38.5355L36.5355 73.4645C34.5829 75.4171 31.4171 75.4171 29.4645 73.4645L6.53554 50.5355Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M10 54L48 16" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M57 17L19 55" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M42 46L26 62" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M38 58L30 66" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M50.1213 38.1213C48.9497 36.9497 48.9497 35.0503 50.1213 33.8787L55.8787 28.1213C57.0503 26.9497 58.9497 26.9497 60.1213 28.1213L63.8787 31.8787C65.0503 33.0503 65.0503 34.9497 63.8787 36.1213L58.1213 41.8787C56.9497 43.0503 55.0503 43.0503 53.8787 41.8787L50.1213 38.1213Z" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                        </svg>

                        <p className="list-svg-text__desc">
                            <span className="list-svg-text__item__title"> Indicate the Trade Amount </span> 
                            
                            Invest starting at $1 or more. 
                        </p>

                    </li>
                    <li className="list-svg-text__item">
                        
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M47.1611 39.0001V36.7068" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M47.1611 24.638V23" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M50.3897 25.1982H47.0169C47.0169 25.1982 42.9451 25.1982 43.0006 28.0833C43.056 30.9684 47.0169 30.7359 47.0169 30.7359C47.0169 30.7359 51.0221 30.6725 50.9999 33.4941C50.9777 36.3158 47.0169 36.2735 47.0169 36.2735H43.5331" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M10.3672 67.946L10.8347 68.4133C12.4709 70.0488 15.1199 70.0488 16.756 68.4133L34.1401 51.0359L27.7416 44.6399L10.3672 62.027C8.7311 63.6625 8.7311 66.3105 10.3672 67.946Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M46.5 54C58.9264 54 69 43.9264 69 31.5C69 19.0736 58.9264 9 46.5 9C34.0736 9 24 19.0736 24 31.5C24 43.9264 34.0736 54 46.5 54Z" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M24.1104 48.79L30.1104 54.79" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M46.5 48C55.6127 48 63 40.6127 63 31.5C63 22.3873 55.6127 15 46.5 15C37.3873 15 30 22.3873 30 31.5C30 40.6127 37.3873 48 46.5 48Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                        </svg>

                        <p className="list-svg-text__desc">
                            <span className="list-svg-text__item__title"> Choose Which Way the Price Will Go </span> 
                            
                            Use ready-to-go indicators and strategies.
                        </p>

                    </li>
                    <li className="list-svg-text__item">
                        
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M28 24C37.3888 24 45 20.4183 45 16C45 11.5817 37.3888 8 28 8C18.6112 8 11 11.5817 11 16C11 20.4183 18.6112 24 28 24Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11 25C11 29.4183 18.6112 33 28 33V33C37.3888 33 45 29.4183 45 25" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M17.4592 49.2769C20.3565 50.3559 24.0185 51 28.0001 51C32.7749 51 37.0899 50.0737 40.1779 48.582" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11 61C11 65.4183 18.6112 69 28 69C32.2114 69 36.0652 68.2793 39.0348 67.0858" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11 34C11 38.4183 18.6112 42 28 42C30.9058 42 33.6413 41.6569 36.0336 41.0521" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11 52C11 56.4183 18.6112 60 28 60C31.2728 60 34.3296 59.5648 36.9234 58.8106" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M53.5 75C62.6127 75 70 67.6127 70 58.5C70 49.3873 62.6127 42 53.5 42C44.3873 42 37 49.3873 37 58.5C37 67.6127 44.3873 75 53.5 75Z" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M11 16V61" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M45 16V44.2" stroke="white" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M53.5001 68.2563V65.3916" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M53.5001 50.3025V48.2539" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                            <path d="M57.7176 51.0059H53.5077C53.5077 51.0059 48.431 51.0045 48.501 54.6061C48.5709 58.2077 53.5077 57.9239 53.5077 57.9239C53.5077 57.9239 58.5033 57.8427 58.4756 61.3699C58.448 64.8971 53.5077 64.8385 53.5077 64.8385H49.1636" stroke="#6aff41" stroke-width="2" stroke-linecap="round"></path>
                        </svg>

                        <p className="list-svg-text__desc">
                            <span className="list-svg-text__item__title"> Make a Profit </span> 
                            
                            Withdraw funds without platform commissions.
                        </p>

                    </li>
                
                </ul>

            </div>

          </div>


          
    </div>
  );
};


export default Aboutus;
