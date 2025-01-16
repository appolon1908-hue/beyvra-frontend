import "./RegisterBlock.scss";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

//img
import IphoneOneImg from "../../../../../assets/markets/1.png";
import IphoneOneMobileImg from "../../../../../assets/markets/iphoneOneMobile.png";
import IphoneTwoImg from "../../../../../assets/markets/2.png";
import IphoneTwoMobileImg from "../../../../../assets/markets/iphoneTwoMobile.png";
import LinesImg from "../../../../../assets/markets/lines.png";
import LinesTwoImg from "../../../../../assets/markets/lines2.png";
import TrustPilotImg from "../../../../../assets/markets/trustpilot.png";
import GoogleSvg from "../../../../../assets/markets/google.svg";
import AppleSvg from "../../../../../assets/markets/apple.svg";
import FacebookSvg from "../../../../../assets/markets/facebook.svg";
import useWindowWidth from "hooks/useWindowWidth";
import { useTranslation } from "react-i18next";

// Defined validation schema for input fields
const validationSchema = Yup.object({
  name: Yup.string().required("thisFieldIsRequired"),
  email: Yup.string()
    .email("invalidEmailFormat")
    .required("thisFieldIsRequired"),
});

const RegisterBlock = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const windowWidth = useWindowWidth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      formik.resetForm();
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="registerBlockWrapper">
      <div className="registerBlockContainer">
        <img className="registerBlockLines" src={LinesImg} alt="" />
        <img className="registerBlockLinesTwo" src={LinesTwoImg} alt="" />

        {windowWidth > 728 ? (
          <div className="registerBlockImages">
            <img src={IphoneOneImg} alt="" />
            <img src={IphoneTwoImg} alt="" />
          </div>
        ) : (
          <div className="registerBlockImages">
            <img src={IphoneOneMobileImg} alt="" />
            <img src={IphoneTwoMobileImg} alt="" />
          </div>
        )}

        <div className="registerBlockInputs">
          <div>
            <h2>{t("readyToTrade")}</h2>
            <h2>{t("createAccount")}!</h2>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div>
              <input
                className={`${
                  formik.touched.name && formik.errors.name ? "inputError" : ""
                }`}
                placeholder={t("enterYourEmail")}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name ? (
                <p>{t(formik.errors.name)}</p>
              ) : null}
              <input
                className={`${
                  formik.touched.email && formik.errors.email
                    ? "inputError"
                    : ""
                }`}
                placeholder={t("enterYourPassword")}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <p>{t(formik.errors.email)}</p>
              ) : null}
            </div>
            <button onClick={() => formik.handleSubmit()}>
              {t("createAccount")}
            </button>

            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              {t("byCreatingAccountAgree")} <span>{t("privacyPolicy")}</span>,{" "}
              <span>{t("cookiePolicy")}</span>{" "}
              {t("byCreatingAccountAgreeContinues")}{" "}
            </label>
          </form>

          <div className="registerBlockIcons">
            <img src={GoogleSvg} alt="" />
            <img src={FacebookSvg} alt="" />
            <img src={AppleSvg} alt="" />
          </div>
          <img
            className="registerBlockTrustPilotImg"
            src={TrustPilotImg}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterBlock;
