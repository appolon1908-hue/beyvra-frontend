import React from 'react'
import './trading.scss'
import Landing from './platform/landing/Landing'
import CTABanner from './components/call-to-action/CTABanner'
import ProfileCard from './CopyTrade/profileCard/ProfileCard'
import TradingCardInfo from './components/tradingCardInfo/TradingCardInfo'
import IconShield from '../../../assets/trading/cardIconStarShield.png'
import IconWave from '../../../assets/trading/cardIconWaves.png'
import PerksCard from './components/perksCard/PerksCard'
import TradingSteps from './components/tradingSteps/TradingSteps'
import TradingExperience from './components/experience/TradingExperience'
import user from '../../../assets/trading/adam-nowakowski-D4LDw5eXhgg-unsplash 2.png'
import CopyTrade from './components/copyTrade/CopyTrade'
import CostExplanation from './components/tradingCostExplanation/CostExplanationComp'
import TradingProfitCalculator from '../../../components/tradingProfitCalculator/TradingProfitCalculator'
import USUKICon from '../../../assets/trading/UKUS_Oil_2_48e9f9e285.svg fill.png'
import CanIcon from '../../../assets/trading/canadaflagicon.png'
import BgImage from '../../../assets/trading/adam-tradingProfit.png'
import ProfitMarginGuide from './profitMarginGuide/ProfitMarginGuide'
import TradeAnalyzer from './components/tradeAnalyzer/TradeAnalyzer'
import UkIFlag from '../../../assets/trading/UK.png'
import StraightForwardTrading from './platform/straightForwardTradingComponent/StraightForwardTrading'
// import LandingPageMobile from './LandingPageMobileTrading/LandingPageMobile'
import imageBgEve from '../../../assets/trading/eve-nowakowski-D4LDw5eXhgg.png'
import imageBgAdamLp from '../../../assets/trading/adam-nowakowski-D4LDw5eXhgg-unsplash.png'
import TrackTrade from './CopyTrade/trackTradeHeader/TrackTrade'
import MetaTrading from './components/metaTrading/MetaTrading'
import LandingPageMobile from './tradingMobile/LandingPageMobileTrading/LandingPageMobile'
import TrackTradeLanding from './CopyTrade/trackTradeHeader/TrackTrade'
import MetaTrader4Landing from './metaTrading4/metaTrader4Landing/MetaTrader4'
import MetaTrader5Landing from './metaTrading5/metaTrader5/MetaTrader5Landing'
import Navbar from '../home/commonComponents/navbar/Navbar'
import ForexCalculator from 'pages/public/trading/components/forexCalculator/ForexCalculator'

const Trading = () => {
  return (
    <div className='tradingContainer' >
      <Navbar />
      <Landing />
      <div className="container">
      <StraightForwardTrading/>

      </div>

      <LandingPageMobile/> 

      
   

        <MetaTrader4Landing/>

        <div className="container">
        <TradingExperience  
        image={imageBgEve} 
        title={"Use MT4 to trade with tradex.io"} 
        text={"If you already have a tradex.io account, you are all set. Now you can simply install MT4 and add a trading account via your desktop markets.com platform. For more information on how to add MetaTrader trading account please click here. If you don’t have a markets.com account yet, don’t worry – registering is easy and fast."}
        button={true}
        />

      </div>
       <MetaTrader5Landing/>
      <div className="container">
      <TradingExperience  
        image={imageBgAdamLp} 
        title={"Elevate your trading experience with MetaTrader 5"} 
        text={"Use your markets.com account to seamlessly install MT5 and start trading right away in your desktop markets.com platform. The video tutorial above can walk you through the process. Explore here step-by-step instructions on adding a MetaTrader 5 trading account. Don't have a markets.com account yet? No worries, visit the markets.com Sign Up page and provide the required information to quickly complete full registration. "}
        button={true}
        />
      </div>


       <TrackTradeLanding/> 



        <div className='container'>


        <div className='tradingCardContainer'> 


            <TradingCardInfo 
            cardTitle='Multi-Asset Platform' 
            cardText='Upgraded platform rich with features & thousands of assets to speculate on.' 
            icon={"/trading-images/wheelIcon.png"} /> 
            <TradingCardInfo 
            cardTitle='Multi-Asset Platform' 
            cardText='Upgraded platform rich with features & thousands of assets to speculate on.' 
            icon={IconShield} /> 
            <TradingCardInfo 
            cardTitle='Multi-Asset Platform' 
            cardText='Upgraded platform rich with features & thousands of assets to speculate on.' 
            icon={IconWave} /> 

          </div>

          <div className='tradingCardContainer margin'> 


          <PerksCard 
          icon="/trading-images/Eye.png"
          cardTitle='Insights at Your Fingertips'
          cardText='Seamlessly follow top traders strategies.'
          type='trade'
          />

          <PerksCard 
          icon="/trading-images/Graphs.png"
          cardTitle='Insights at Your Fingertips'
          cardText='Enhance your markets analysis through witnessed strategies for informed decisions.'
          type='trade'

          />

          <PerksCard 
          icon="/trading-images/podcast-icon.png"
          cardTitle='Real-Time Signals'
          type='trade'

          cardText='Get instant trading signals and follow trades to access potential market opportunities.'
          />

          <PerksCard 
          icon="/trading-images/automation-icon.png"
          cardTitle='Savvy Traders Automation'
          type='follower'

          cardText='Get instant trading signals and follow trades to access potential market opportunities.'
          />
          <PerksCard 
          icon="/trading-images/briefcase-icon.png"
          cardTitle='Portfolio Diversification'
          type='follower'

          cardText='Explore different approaches to trading for a more balanced experience with top performing strategies.'
          />
             <PerksCard 
          icon="/trading-images/podcast-icon.png"
          cardTitle='Real-Time Signals'
          type='follower'

          cardText='Get instant trading signals and follow trades to access potential market opportunities.'
          />

         </div>



        </div>
        <TradingSteps
        step1="Sign up for a
        Tradex.io account"
        step2='Login to 
        Tradex.io'
        step3="Select Copy Trading"
        step4="Review  Profile Stats"
        // step5="Select a profile to Copy "

/>

<TradingSteps
        step1="Sign up for a
        Tradex.io account"
        step2='Login to 
        Tradex.io'
        step3="Select Copy Trading"
        step4="Review  Profile Stats"
        step5="Select a profile to Copy "

/>



        <div className='container'>
          <CTABanner/>
        </div>

        <div className="container">
        <TradingExperience  
        image={user} 
        title={"Elevate your trading experience with MetaTrader 5"} 
        text={"Use your markets.com account to seamlessly install MT5 and start trading right away in your desktop markets.com platform. The video tutorial above can walk you through the process. Explore here step-by-step instructions on adding a MetaTrader 5 trading account. Don't have a markets.com account yet? No worries, visit the markets.com Sign Up page and provide the required information to quickly complete full registration."}/>

        </div>

        <ProfileCard/>

        <div className='container'>
          <CopyTrade />

        </div>

        <div className="container">
          {/* <ForexCalculator /> */}
        </div>


        <div className='container'>
        <CostExplanation/>

        </div>
        <div className='container'>
          <TradingProfitCalculator 
          title="How Does a Forex Profit Calculator Work?"
          text1='You might find yourself asking, ‘How Can I Calculate Profit in Forex?’, or ‘How do you calculate profit or loss in forex trading?’. Well fortunately for you, the markets.com forex profit calculator makes things easy.'
          text2="The calculator is designed to help you calculate potential gains and losses on each currency trade. Simply input the values requested: the currency pair being traded, the position size, entry price, and the exit price to accurately determine potential gains or losses. The markets.com calculators already include spreads when determining the outcome and the 0% commission we offer on the platform. With this information, the calculator can quickly and accurately determine how much you would hypothetically make or lose on a trade."
          icon1={USUKICon}
          image={BgImage}
          icon2={CanIcon}/>
        </div>

    <div className="container">
      <ProfitMarginGuide
        title="How is Profit Calculated in ForexTrading?"
        text1='Profit in forex trading is calculated by subtracting the entry price from the exit price of a trade. This can be in either a positive or negative value depending on whether the trade resulted in a loss or gain. Forex traders will look to open a trade at a lower price and close it at a higher price, in order to turn a profit'
        text2="However, you don't need to do these calculations manually as
tradex.io offers a commodity calculator that does the job for you. You simply need to input the necessary information, and the calculator will provide you with the estimate profit or loss amount. This makes the process simple and convenient, allowing you to focus on making informed trading decisions."
        icon1={USUKICon}
        image={BgImage}
        icon2={UkIFlag}
        />
    </div>

    <div className="container">
    </div>
    <div className="container">
      <TrackTrade/>
    </div>
    <div className="container">
      <MetaTrading title='Trade using MT4 with tradex.io'
      body='You can access popular and easy-to-use web trading platform MetaTrader 4 with your markets.com account. A complete listing of our trading conditions for trading via MetaTrader platforms'
      type= "mt5"/>
    </div>
       
    </div>
  )
}

export default Trading