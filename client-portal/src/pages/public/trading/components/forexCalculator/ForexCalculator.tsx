import React from 'react'
import './forexCalculator.scss'
import Droplet from '../../../../../assets/trading/red-droplet.png'
import CornBg from '../../../../../assets/trading/corn_with-gray-bg (1).png'

interface forexCalcProps{

  mainImg: string, 
  title: string,
  text1: string,
  text2?: string
}
const ForexCalculator: React.FC<forexCalcProps> = ({mainImg,  text1, text2, title}) => {
  return (
    <div className='forexCalculator'>
        <div className="background-graphic">
            <div className='calculatorGraphic'>
              <img src={mainImg} alt="" className='main-image' />
              <img src={Droplet} alt="" className='droplet' />
              <img src={CornBg} alt="" className='cornBg' />
            </div>
          </div> 
          <div className='forexProfitText'>
            <h3>{title}</h3>
            <p>{text1}</p>
            <p>{text2}</p>

        </div>
    </div>
  )
}

export default ForexCalculator