import './tradingExperience.scss'
import plus from '../../../../../assets/trading/+.png'
const TradingExperience = ({image, title, text, button} : {image?: string, title?: string, text?: string, button?: boolean }) => {
  return (
    <div className='trading-experience'>
        <div className='exp-info'>
            <h3>{title}</h3>
            <p> {text} </p>
            {button && (<button>Join Now</button>)}
        </div>
        <div className='exp-graph'> 
            <img src={image} alt="user image" className='user' />
            <img src={plus} alt="dot background image" className='dot' />
        </div>
        
    </div>
  )
}

export default TradingExperience