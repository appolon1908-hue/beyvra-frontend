import { Link, useNavigate } from 'react-router-dom'
import './lastStep.scss'
import useDisableWalkThrough from 'api/user/useDisableWalkthrough';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { useCookies } from 'react-cookie';
import { updateWalkthrough } from '@store/slices/user';
import { useTranslation } from 'react-i18next';

const LastStep = ({onReset}: any) => {

  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate()
  const { mutate, isPending } = useDisableWalkThrough({
    onSuccess: (data) => {
      dispatch(updateWalkthrough());
      
      navigate('/platform')
    },
    onError: (error) => {
      console.error('Please complete the walkthrough', error);
    },
  });
  


  const handleFinishWalkThrough = () =>{
    
    // mutate({
    //   token: cookies.access_token,
    // });

    if (cookies.access_token) {
      // Call the mutate function to disable the walkthrough
      mutate({
        token: cookies.access_token,
      });
    } else {
      console.error('No access token found. User cannot be authenticated.');
      // Optionally handle the case where the token is not available
    }
    

  };
  return (
    <div className='lastStepContainer'>
       <div className='lastStepModal'>
        <div className='lastStepModalHeader'>
            <h2>{t("doYouWantToFinishTraining")}</h2>
            <span>{t("resumeTrainingInHelpSection")}</span>
        </div>
        <div className='lastStepModalButtonContainer'>
            <button className='lastStepCancelButton' onClick={()=> onReset(1)}>{t("cancel")}</button>
            <Link to={'/platform'}>
            <button className='lastStepFinishButton' onClick={handleFinishWalkThrough} disabled={isPending}>{isPending ? t("loading") : t("finish")}</button>
            </Link>
        </div>
       </div>
    </div>
  )
}

export default LastStep