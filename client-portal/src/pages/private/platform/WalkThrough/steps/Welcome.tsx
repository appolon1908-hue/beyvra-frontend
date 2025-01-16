import { useTranslation, withTranslation } from "react-i18next";

import "./Welcome.scss";
interface WelcomeProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const Welcome: React.FC<WelcomeProps> = ({ className, setStep }) => {
  const { t } = useTranslation();

  return (
    <div className={`walkthroughStep welcomeStep ${className}`}>
      <img
        className="welcomeImg"
        src="/walkthrough/welcome.png"
        alt="Welcome Illustration"
      />
      <p className="walkthroughHeading">{t("welcome")}</p>
      <p className="walkthroughSubtext">{t("walkthroughWelcomeSubText")}</p>
      <button className="walkthroughButton" onClick={() => setStep(2)}>
        {t("startTraining")}
      </button>
    </div>
  );
};

export default withTranslation()(Welcome);
