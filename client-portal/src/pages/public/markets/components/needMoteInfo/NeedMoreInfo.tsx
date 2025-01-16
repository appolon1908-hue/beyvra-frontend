import { useTranslation } from "react-i18next";
import "./NeedMoreInfo.scss";
import { FC, useState } from "react";
import PlusSvg from "../../../../../assets/markets/plus.svg";

interface ItemProps {
  num: number;
  question: string;
  answer: string;
}

interface NeedMoreInfoProps {
  items: ItemProps[];
}

const NeedMoreInfo: FC<NeedMoreInfoProps> = ({ items }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);

  const handleOpen = (num: number) => {
    setActive(active === num ? null : num);
  };

  return (
    <div className="needMoreInfoContainer">
      <h2>{t("needMoreInformation")}</h2>
      <div className="needMoreInfoQuestions">
        {items &&
          items.map((item, index) => (
            <div key={index + item.num}>
              <p onClick={() => handleOpen(item.num)}>
                <span>{t(item.question)}</span>
                <img src={PlusSvg} alt="" />
              </p>
              {active === item.num && (
                <span className="needMoreInfoAnswer">{t(item.answer)}</span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default NeedMoreInfo;
