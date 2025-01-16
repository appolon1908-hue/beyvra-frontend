import Switch from "antd/es/switch";
import "./toggle.scss";
import { useAppSelector } from "@store/hooks";

interface ToggleProps {
  label?: string;
  subtext?: string;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  infoText?: string;
  onClickInfo?: () => void;
}

const Toggle: React.FunctionComponent<ToggleProps> = ({
  label,
  subtext,
  onChange,
  defaultChecked = false,
  infoText,
  onClickInfo,
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} customToggle`}>
      <div className="toggleContainer">
        <div className="toggleTextContainer">
          {label ? <p className="toggleLabel">{label}</p> : null}
          {subtext ? <p className="toggleSubtext">{subtext}</p> : null}
        </div>
        <Switch defaultChecked={defaultChecked} onChange={onChange} />
      </div>
      {infoText ? (
        <p className="infoText" onClick={onClickInfo}>
          {infoText}
        </p>
      ) : null}
    </div>
  );
};

export default Toggle;
