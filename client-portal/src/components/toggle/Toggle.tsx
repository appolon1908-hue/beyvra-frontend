import { useAppSelector } from "@store/hooks";
import Switch from "antd/es/switch";

import "./toggle.scss";

interface ToggleProps {
  label?: string;
  subtext?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  infoText?: string;
  onClickInfo?: () => void;
}

const Toggle: React.FunctionComponent<ToggleProps> = ({
  label,
  subtext,
  onChange,
  checked,
  defaultChecked = false,
  disabled = false,
  infoText,
  onClickInfo,
}) => {
  const { themeSelect } = useAppSelector((state) => state.themeBg);

  return (
    <div className={`${themeSelect} customToggle`}>
      <div className="toggleContainer">
        <div className="toggleTextContainer">
          {label ? <p className="toggleLabel">{label}</p> : null}
          {subtext ? <p className="toggleSubtext">{subtext}</p> : null}
        </div>
        <Switch
          checked={checked}
          defaultChecked={checked === undefined ? defaultChecked : undefined}
          disabled={disabled}
          onChange={onChange}
        />
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
