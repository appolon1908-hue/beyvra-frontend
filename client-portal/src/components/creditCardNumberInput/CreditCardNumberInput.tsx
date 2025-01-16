import { ChangeEventHandler, HTMLInputTypeAttribute, useEffect } from "react";
import "./CreditCardInput.scss";
import { 
    creditCardType, 
    formatCreditCardExpirationDate, 
    formatCreditCardNumber, 
    isArrayEmpty 
} from "utils/utils";
import { 
    AmericanCreditCardIcon, 
    JcbCreditCardIcon, 
    MasterCardIcon, 
    VisaCardIcon 
} from "assets/icons";
const CreditCardsList = [
    {
      icon: <AmericanCreditCardIcon />,
      text: 'AMEX'
    },
    {
      icon: <JcbCreditCardIcon />,
      text: 'JCB'
    },
    {
      icon: <MasterCardIcon />,
      text: 'MASTERCARD'
    },
    {
      icon: <VisaCardIcon />,
      text: 'VISA'
    },
];


export const CreditCardNumberInput = ({
  placeholder,
  classname,
  placeholderColor,
  marginTop,
  name,
  inputValue,
  onChange,
}: {
  CardsIconList?: React.ReactNode[] | any;
  placeholder: string;
  classname?: string;
  placeholderColor?: boolean;
  marginTop?: boolean;
  type?: HTMLInputTypeAttribute;
  onChange: ChangeEventHandler<HTMLInputElement>;
  allowEmptyFormatting?: boolean;
  name: string;
  inputValue: string,
}) => {
   
  const filterCreditCardIcons = () => {
    if(!inputValue) return CreditCardsList;
    const getValue = creditCardType(inputValue);

    const returnArray = CreditCardsList.filter((item) => item.text === getValue);
    return isArrayEmpty(returnArray)? CreditCardsList : returnArray;
  };


  useEffect(() => {
    filterCreditCardIcons();
  }, [inputValue]);

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
          maxLength={19}
          value={formatCreditCardNumber(inputValue)}
        />
      
        {CreditCardsList &&
            <div className="credit-cards-container">
                {filterCreditCardIcons().map((card: any, index: number) => (
                    <div key={index} className="credit-cards">
                        {card.icon}
                    </div>
                
                ))}
            </div>
        }
    </div>
  );
};


export const CreditCardCVVInput = ({
    placeholder,
    classname,
    placeholderColor,
    marginTop,
    name,
    inputValue,
    onChange,
  }: {
    CardsIconList?: React.ReactNode[] | any;
    placeholder: string;
    classname?: string;
    placeholderColor?: boolean;
    marginTop?: boolean;
    type?: HTMLInputTypeAttribute;
    onChange: ChangeEventHandler<HTMLInputElement>;
    allowEmptyFormatting?: boolean;
    name: string;
    inputValue: string | number,
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
            maxLength={3}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            value={inputValue}
          />
       
      </div>
    );
};

export const CreditCardExpiryDate = ({
    placeholder,
    classname,
    placeholderColor,
    marginTop,
    name,
    inputValue,
    onChange,

  }: {
    CardsIconList?: React.ReactNode[] | any;
    placeholder: string;
    classname?: string;
    placeholderColor?: boolean;
    marginTop?: boolean;
    type?: HTMLInputTypeAttribute;
    onChange: ChangeEventHandler<HTMLInputElement>;
    allowEmptyFormatting?: boolean;
    name: string;
    inputValue: string | number,
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
            value={formatCreditCardExpirationDate(inputValue)}
          />
      </div>
    );
  };
  
  

