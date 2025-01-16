import {  BottomEllipse, TopEllipse } from "../../../assets/icons";
import "./lenderBankCard.scss";

interface LenderBankCardProps {
  name?: string;
  image?: string;
  small?: boolean;
  topElipseBottom?: string;
  topElipseright?: string;
  topElipseLeft?: string;
  topElipseTop?: string;
  bottomElipseBottom?: string;
  bottomElipseright?: string;
  bottomElipseLeft?: string;
  bottomElipseTop?: string;
  topColor?: string;
  topDisplay?: string;
  bottomDisplay?:string;
  bottomColor?:string;
}

const LenderBankCard: React.FunctionComponent<LenderBankCardProps> = ({
  name,
  image,
  small,
  topElipseBottom,
  topElipseright,
  topElipseLeft,
  topElipseTop,
  bottomElipseBottom,
  bottomElipseright,
  bottomElipseLeft,
  bottomElipseTop,
  topColor,
  topDisplay,
  bottomDisplay,
  bottomColor
}) => {
  console.log('image');
  return (
    <div className={small ? "bankCardWrapperContSmall" : "bankCardWrapperCont"}>
      <div className="yellow" style={{right:topElipseright,bottom:topElipseBottom, left:topElipseLeft,top:topElipseTop ,display:topDisplay}}>
        <TopEllipse color={topColor} />
      </div>
      <div className="blue" style={{right:bottomElipseright,bottom:bottomElipseBottom, left:bottomElipseLeft,top:bottomElipseTop ,display:bottomDisplay}}>
        <BottomEllipse color={bottomColor} />
      </div>
      <div className={small ? "bankCardSmall" : "bankCard"}>
        {image ? <img src={image} className={small ? "bankImageSmall" : "bankImage"} alt={name} /> : <p>{name}</p>}
      </div>
    </div>
  );
};

export default LenderBankCard;
