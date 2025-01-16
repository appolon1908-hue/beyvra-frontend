import { useTranslation } from 'react-i18next';
import './headIntro.scss'

interface HeadIntroProps{
    title:string;
    detail:string;
    buttonTitle: string;
}
const HeadIntro:React.FC<HeadIntroProps> = ({title,detail,buttonTitle}) => {
  const { t } = useTranslation()
 
  return (
    <div className="headIntroContainer">
        <h2>{t(title)}</h2>
        <p>{t(detail)}</p>
        <button>{t(buttonTitle)}</button>
    </div>
  )
}

export default HeadIntro