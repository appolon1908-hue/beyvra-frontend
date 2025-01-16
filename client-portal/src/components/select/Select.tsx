import { ReactNode } from "react";
import { Select as SelectOriginal } from "antd";
import { DropdownIcon } from "../../assets/icons";
import "./selectList.scss";
import { useAppSelector } from "@store/hooks";

interface SelectProps {
  handleChange?: (value: any) => void;
  onClick?: (value: any) => void;
  onBlur?: (value: any) => void;
  options?: { value: string; label: string | ReactNode }[];
  defaultValue?: string;
  label: string;
  icon?: ReactNode;
  background?: string;
  height?: string;
  customRootClass?: string;
}

const Select: React.FunctionComponent<SelectProps> = ({
  handleChange,
  onClick,
  onBlur,
  options = [],
  defaultValue = "",
  label,
  icon,
  background,
  height,
  customRootClass,
}) => {
  const {themeSelect} = useAppSelector(state =>  state.themeBg)
  return (
    <div className={`${themeSelect} selectContainer`}>
      <div className={`selectList ${icon ? "withIcon" : ""}`}>
        {icon ? <div className="iconContainer">{icon}</div> : null}
        {label && <label>{label}</label>}
        <SelectOriginal
          defaultValue={defaultValue}
          style={{ width: 120 }}
          onChange={handleChange}
          options={options}
          suffixIcon={<DropdownIcon />}
          rootClassName={`${themeSelect == 'day' ? "customSelectDropdownDay": "customSelectDropdown"} ${height ? height : ""} ${
            background ? background : ""
          } ${customRootClass}`}
          onClick={onClick}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

export default Select;
