import React from 'react'
import './tradingStep.scss'
import { useTranslation } from 'react-i18next'

interface tradingStepsProp  {
    step1: string,
    step2: string,
    step3: string,
    step4: string,
    step5?: string,
}

const TradingSteps: React.FC<tradingStepsProp>  = ({step1, step2, step3, step4, step5} ) => {
  const {t} = useTranslation()

  return (
    <div className='getting-started-steps'>
      <h2>{t("SocialTradeStep")}</h2>
        
        <div className='getting-started-wrapper'>
        <hr />

        <div>
        <span className='step-1'>1</span>
        <p>{step1}</p>

        </div>
        <div>
        <span className='step-2'>2</span>

        <p>{step2} </p>
        </div>
        <div>
        <span className='step-3'>3</span>
        <p>{step3}</p>
        </div>
        <div>
        <span className='step-4'>4</span>
        <p>{step4}</p>

        </div>
        {step5 && 
        <div>
        <span className='step-5'>5</span>
        <p>{step5} </p>

        </div>
}

        </div>
    </div>
  )
}

export default TradingSteps