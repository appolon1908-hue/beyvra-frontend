import { InputHTMLAttributes } from "react";
import MainItemCard from "../mainItemCard/MainItemCard";
import "./input.scss";
import { useAppSelector } from "@store/hooks";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  title?: string;
  className?: string;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  subTitle?: string;
  variant?: 1 | 2 | 3;
  disabled?: boolean;
  value?: string;
  textOnly?: boolean;
}

const Input: React.FunctionComponent<InputProps> = ({
  id,
  placeholder,
  title,
  className,
  icon,
  suffixIcon,
  defaultValue,
  onChange,
  type,
  variant = 2,
  subTitle,
  disabled,
  value,
  textOnly,
  ...rest
}) => {
  const { themeSelect } = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} inputContainer`}>
      <MainItemCard
        variant={variant}
        pointer={false}
        className={`input_main ${className ? className : ""}`}
      >
        {icon ? <div className="inputIcon">{icon}</div> : null}
        <div className="inputContainer">
          {title ? (
            <label>
              {title} <span> {subTitle}</span>
            </label>
          ) : null}
          {!textOnly ? <input
            id={id}
            disabled={disabled}
            type={type}
            onChange={onChange}
            defaultValue={defaultValue}
            placeholder={placeholder}
            value={value}
            {...rest}
          />
            :
            <span>{value}</span>
          }
        </div>
        {suffixIcon ? <div className="suffixIcon">{suffixIcon}</div> : null}
      </MainItemCard>
    </div>
  );
};

export default Input;
