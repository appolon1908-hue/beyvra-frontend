import './leadPlatform.scss'
import React, { PropsWithChildren } from 'react';

import LicenceIcon from '../../../../../assets/home/leadPlatform/licence.png'
import BanksIcon from '../../../../../assets/home/leadPlatform/Banks.png'
import CustomerSupportIcon from '../../../../../assets/home/leadPlatform/customerSupport.png'
import SecurityIcon from '../../../../../assets/home/leadPlatform/security.png'
import TransparentIcon from '../../../../../assets/home/leadPlatform/transparent.png'
import UnparallelIcon from '../../../../../assets/home/leadPlatform/unparallel.png'
import { useTranslation } from 'react-i18next';

interface LeadPlatformCardProps {
    title: string;
    imgSrc: string;
}

export const LeadPlatformCard: React.FC<PropsWithChildren<LeadPlatformCardProps>> = ({ title, imgSrc }) => {
    return (
      <div className="leadPlatformCard">
        <img src={imgSrc} alt="" />
        <p>{title}</p>
      </div>
    );
}

const LeadPlatform: React.FC = () => {
    const {t} = useTranslation()
    const leadTradingPlatformData = [
        {
            title: t('higlyRegulated'),
            imgSrc:LicenceIcon
        },
        {
            title:t('instantDeposit'),
            imgSrc:BanksIcon
        },
        {
            title:t("24/7customerSupport"),
            imgSrc:CustomerSupportIcon
        },
        {
            title:t('transparentFees'),
            imgSrc:TransparentIcon
        },
        {
            title:t("unparallelTradingConditions"),
            imgSrc:UnparallelIcon
        },
        {
            title:t('endToEndSecurity'),
            imgSrc:SecurityIcon
        },
    ]
  return (
    <div className='leadPlatformContainer'>
        <h2>{t('leadWithOurPlatform')}</h2>
        <div className="leadPlatformCardContainer">
            {
                leadTradingPlatformData.map((item)=>(

                    <LeadPlatformCard title={item.title} imgSrc={item.imgSrc}/>
                ))
            }
        </div>
    </div>
  )
}

export default LeadPlatform