import { Input } from "antd";
import { useTranslation, withTranslation } from "react-i18next";

const RegistrationNode = () => {
  const { t } = useTranslation();
  return (
    <div className="contentContainer">
      <input
        className="loginInput"
        type="text"
        name="firstname"
        id="firstname"
        placeholder={t("firstName")}
      />
      <input
        className="loginInput"
        type="text"
        name="lastname"
        id="lastname"
        placeholder={t("lastName")}
      />
      <input
        className="loginInput"
        type="number"
        name="number"
        id="number"
        placeholder={t("number")}
      />
      <input
        className="loginInput"
        type="email"
        name="email"
        id="email"
        placeholder={t("email")}
      />
      <Input.Password placeholder={t("password")} />
      <button className="register">{t("register")}</button>

      <div className="continueWithText">
        <div className="liner"></div>
        <p>{t("orContinueWith")}</p>
        <div className="liner"></div>
      </div>
      <div className="socialIcons">
        <div className="topIcons">
          <img src="/social-icons/google-round.png" alt="Google" />
          <img src="/social-icons/facebook-round.png" alt="Facebook" />
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(RegistrationNode);
