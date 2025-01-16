import { useTranslation } from "react-i18next";
import "./InfoBlockWithList.scss";
import checkSvg from "../../../../../assets/markets/redCheckbox.svg";
import { FC } from "react";

interface InfoBlockWithListProps {
  item: {
    image: string;
    imageTablet: string;
    imageMobile: string;
    title: string;
    text: string[];
    vector?: string;
    isRevert?: boolean
  };
}

const InfoBlockWithList: FC<InfoBlockWithListProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <div className={`infoBlockWithListContainer ${item.isRevert ? 'isRevert' : ''}`}>
      <div>
        <picture>
          <source srcSet={item.image} media="(min-width: 835px)" />
          <source
            srcSet={item.imageTablet}
            media="(min-width: 479px) and (max-width: 834px)"
          />
          <source srcSet={item.imageMobile} media="(max-width: 478px)" />
          <img src={item.image} alt="" />
        </picture>
        {item.vector && <img className="vectorImg" src={item.vector} alt="" />}
      </div>

      <div>
        <h2>{t(item.title)}</h2>
        <div>
          {item.text.map((it, index) => (
            <span key={index}>
              <img src={checkSvg} alt="" /> {t(it)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoBlockWithList;
