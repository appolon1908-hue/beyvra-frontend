import { Input as InputOriginal, InputProps as OriginalInputProps } from "antd";
import MainItemCard from "../mainItemCard/MainItemCard";
import "./TransferInput.scss";

interface TransferInputProps extends OriginalInputProps {
  title?: string;
  subtitle?: string;
  className?: string;
  icon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const TransferInput: React.FunctionComponent<TransferInputProps> = ({
  placeholder,
  title,
  subtitle,
  className,
  icon,
  suffixIcon,
  defaultValue,
  onChange,
  type,
  ...rest
}) => {
  return (
    <div className="transferInputContainer">
      <MainItemCard
        variant={2}
        pointer={false}
        className={`transfer-input ${className ? className : ""}`}
      >
        {icon ? <div className="inputIcon">{icon}</div> : null}
        <div className="inputContainer">
          {title ? (
            <label className="title">
              {" "}
              {subtitle ? (
                <span className="subtitle">{subtitle}</span>
              ) : null}{" "}
              {title}
            </label>
          ) : null}
          <InputOriginal
            className="inputField"
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={onChange}
            type={type}
            {...rest}
          />
        </div>
        {suffixIcon ? <div className="suffixIcon">{suffixIcon}</div> : null}
      </MainItemCard>
    </div>
  );
};

export default TransferInput;
