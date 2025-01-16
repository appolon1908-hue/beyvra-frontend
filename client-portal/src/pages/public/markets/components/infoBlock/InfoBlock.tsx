import { useTranslation, withTranslation } from "react-i18next";
import "./InfoBlock.scss";
import checkSvg from "../../../../../assets/markets/redCheckbox.svg";
import { FC } from "react";

interface InfoBlockProps {
  item: {
    image: string;
    title: string;
    text: string[];
    main_text?: string;
    main_text_two?: string;
  };
}

const InfoBlock: FC<InfoBlockProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="infoBlockContainer">
      <div>
        <img src={item.image} alt="" />
      </div>

      <div>
        <h2>{t(item.title)}</h2>
        {item.main_text && <span>{t(item.main_text)}</span>}
        <div>
          {item.text.map((it, index) => (
            <span key={index}>
              <img src={checkSvg} alt="" /> {t(it)}
            </span>
          ))}
        </div>

        {item.main_text_two && <span>{t(item.main_text_two)}</span>}
      </div>
    </div>
  );
};

export default withTranslation()(InfoBlock);
