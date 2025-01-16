import Radio from "antd/es/radio";
import "./radio.scss";

interface walletTypeDataProps{
  id:number;
  symbol: string;
  name: string;
  is_crpto:boolean;
  image?:boolean;
  is_active: boolean;
  is_fiat?: boolean;
  longer_name?:string;
}

interface RadioProps {
  label?: string;
  id?: string;
  walletTypeData: walletTypeDataProps;
  subtext?: string;
  onChange?: () => void;
  checked?: boolean;
  infoText?: string;
  onClickInfo?: () => void;
}

const RadioInput: React.FunctionComponent<RadioProps> = ({
  label,
  subtext,
  onChange,
  walletTypeData,
  checked = false,
  infoText,
  id="radio-button",
  onClickInfo,
}) => {
 console.log(walletTypeData);
    return (
      <div className="custom-radio-container">

        <div className="customRadioLeft">
            <input type="radio" id={walletTypeData.id.toString()} checked={checked} onChange={onChange} />
            <label htmlFor={walletTypeData.id.toString()} className="radio-label">{walletTypeData.name} - {walletTypeData.longer_name}</label>
      </div>
      <div className="customRadioRight">
        {
          walletTypeData.is_crpto && (
            <span>Crypto</span>
          )
        }
        <h2>{walletTypeData.symbol}</h2>
      </div>
        </div>
    )
};

export default RadioInput;
