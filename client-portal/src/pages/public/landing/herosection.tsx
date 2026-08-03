import "./landing.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Herosection = () => {
  const { t } = useTranslation();


  return (
    <div className="herosectionparent">

          <div className="first__bgC" aria-hidden="true" />
      <div className="herosection">

        <section className="leftsidehero">
          <div className="herodatacol">
            <p className="heroEyebrow">{t("heroPracticePlatform")}</p>
            <h1 className="title">{t("heroTitle")}</h1>
            <p className="heroLead">{t("heroLead")}</p>
            <div className="heroActions">
              <Link className="heroPrimaryAction" to="/signIn?tab=registration&mode=demo">{t("tryDemo")}</Link>
              <Link className="heroSecondaryAction" to="/signIn?tab=login">{t("login")}</Link>
            </div>
            <p className="demoDisclosure">{t("demoDisclosure")}</p>
          </div>
        </section>
          
      </div>
      <div>
        <p className="container_scroll">
          <img data-test-component="scroll-icon" className="svg-scroll svg-scroll-animation svg-scroll--center " src="scroll-mouse.svg" alt="" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
};


export default Herosection;
