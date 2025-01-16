import React from 'react'
import './copyTrade.scss'
import user from '../../../../../assets/trading/adam-nowakowski-D4LDw5eXhgg.png'
import flagIcon from '../../../../../assets/trading/flagIcon.png'
import groupIcon from '../../../../../assets/trading/Group_3539.png'
import ProfilePic from '../../../../../assets/trading/profile-pic.jpeg'
const CopyTrade = () => {
  return (
    <div className='copyTrade-wrapper'>

        <div className='copy-graph'> 
        <img src={flagIcon} className='flag-icon' alt="pic" />
        <img src={groupIcon} alt="pic"  className='group-icon' />
       
        <ImageCard  avatar={ProfilePic} name="Lana" profit="+6,103" ROI="+89"
        />


            <img src={user} alt="" className='user'  />


        

        </div>
        <div className='copyTrade-info'>
            <div>

            <h3>What is copy trading?</h3>
            <p>
            Experience the mix of social interaction and learning with Tradex Social Trading. Follow top traders, replicate their strategies, and gain insights, ideal for both new and seasoned traders. </p>
           
           
           <p className='extra-note'>*Trading carries a considerable risk of capital loss. Please trade wisely.</p>
            <button>Join Now</button>
            </div>

        </div>
        
        
    </div>
  )
}

export const ImageCard = ({avatar, name, profit, ROI, style} : {avatar: string,  name: string, profit: string, ROI: string, style?: {}}) => (
    <div style={style} className='pic-card'>
        <div className='pic-wrapper'>
        <img src={avatar} alt="pic" />
         </div>
        <div className='pic-info'>
            <p className='name'>{name}</p>
            <p className='fig'>{profit}</p>
            <p className='ROI'>ROI <span>{ROI}</span> </p>
            <button>follow</button>
        </div>
    </div>
)



export default CopyTrade