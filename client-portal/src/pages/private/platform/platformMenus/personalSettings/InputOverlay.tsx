import { ReactNode } from "react";

const InputOverlay = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const onItemClick = () => {
    if (!disabled) {
      onClick && onClick();
    }
  };
  return (
    <div className="settingsMenuItem">
      <div
        className={`settingsMenuItemOverlay ${disabled ? "disabled" : ""}`}
        onClick={onItemClick}
      ></div>
      {children}
    </div>
  );
};

export default InputOverlay;
