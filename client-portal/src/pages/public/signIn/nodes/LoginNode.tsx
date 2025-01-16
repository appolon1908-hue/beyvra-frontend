import { Checkbox, Input } from 'antd';
import { useTranslation, withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginNode = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="contentContainer">
      <input
        className="loginInput"
        type="email"
        name="email"
        id="email"
        placeholder={t("email")}
      />
      <Input.Password placeholder={t("password")} />
      <Checkbox>{t("dontRememberMe")}</Checkbox>
      <p className="forgotPass">{t("forgotYourPassword")}</p>

      <button onClick={() => navigate("/platform")} className="login">
        {t("login")}
      </button>

      <div className="continueWithText">
        <div className="liner"></div>
        <p>{t("orContinueWith")}</p>
        <div className="liner"></div>
      </div>
      <div className="socialIcons">
        <div className="topIcons">
          <img src="/social-icons/google-round.png" />
          <img src="/social-icons/facebook-round.png" />
        </div>
      </div>
    </div>
  );
};


export default withTranslation()(LoginNode);