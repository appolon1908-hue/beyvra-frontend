import { useTranslation } from "react-i18next";
import "./InfoBlockWithButton.scss";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface InfoBlockWithButtonProps {
  item: {
    image: string;
    imageTablet: string;
    title: string;
    text: string;
    buttonText: string
  };
}

const InfoBlockWithButton: FC<InfoBlockWithButtonProps> = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="infoBlockWithButtonContainer">
      <div>
        <h2>{t(item.title)}</h2>
        <span>{t(item.text)}</span>
        <button type="button" onClick={() => navigate('/signIn')}>{t(item.buttonText)}</button>
      </div>
      {/* <img src={item.image} alt="" /> */}

      <picture>
          <source srcSet={item.image} media="(min-width: 835px)" />
          {/* <source
            srcSet={item.imageTablet}
            media="(min-width: 479px) and (max-width: 834px)"
          /> */}
          <source srcSet={item.imageTablet} media="(max-width: 834px)" />
          <img src={item.image} alt="" />
        </picture>
    </div>
  );
};

export default InfoBlockWithButton;
