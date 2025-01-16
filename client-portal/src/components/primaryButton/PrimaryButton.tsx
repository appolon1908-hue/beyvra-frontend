import { Spin } from "antd";
import "./primaryButton.scss";

const PrimaryButton = ({
  Title,
  onClick,
  className,
  disabled,
  icon,
  htmlType,
  loading,
  backgroundColor,
}: {
  Title: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  backgroundColor?:string;
}) => {
  const buttonType = htmlType || "button";

  return (
    <button
      type={buttonType}
      className={`ButtonContainer ${disabled ? "disable" : ""} ${className}`}
      onClick={onClick}
      style={{backgroundColor: backgroundColor}}
    >
      {icon}
      {Title}
      {loading ? <Spin size="small" /> : null}
    </button>
  );
};

export default PrimaryButton;
