import { useTranslation } from "react-i18next";
import "./JoinInThreeSteps.scss";
import { ListData } from "./data";
import Slider from "react-slick";

const JoinInThreeSteps = () => {
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    cssEase: "linear",
    arrows: false,
  };

  return (
    <div className="threeStepsContainer">
      <h2>{t("marketsSteps")}</h2>
      <div className="threeStepsItems">
        {ListData &&
          ListData.map((item, index) => (
            <div key={index + item.step}>
              <img src={item.image} alt="" />
              <span>
                {item.step}. {t(item.text)}
              </span>
            </div>
          ))}
      </div>

      <div className="threeStepsItemsMobile">
        <Slider {...settings}>
          {ListData.map((item, index) => (
            <div key={index + item.step}>
              <img src={item.image} alt="" />
              <span>
                {item.step}. {t(item.text)}
              </span>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default JoinInThreeSteps;
