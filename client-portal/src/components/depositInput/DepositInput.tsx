import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import "./DepositInput.scss";

const DepositInput = ({
  CardsIconList,
  placeholder,
  classname,
  placeholderColor,
  marginTop,
  allowEmptyFormatting=false,
  format,
  name,
  value,
  onChange,
  type = "pattern"
}: {
  CardsIconList?: React.ReactNode[] | any;
  placeholder: string;
  classname?: string;
  placeholderColor?: boolean;
  marginTop?: boolean;
  type?: HTMLInputTypeAttribute;
  onChange: ChangeEventHandler<HTMLInputElement>;
  allowEmptyFormatting?: boolean;
  format: string;
  name: string;
  value: string | number,
}) => {
  return (
    <div
      className={`deposit-Input-Wrapper ${
        marginTop ? "marginTop" : "marginTop2"
      } ${classname}`}
    >
      
        <input
          className={`deposit-input ${
            placeholderColor ? "placeholderColor" : "placeholderColor2"
          }`}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      
      {CardsIconList &&
        CardsIconList.map((card: any, index: number) => (
          <div key={index} className="credit-cards">
            {card.icon}
          </div>
        ))}
    </div>
  );
};

export default DepositInput;
