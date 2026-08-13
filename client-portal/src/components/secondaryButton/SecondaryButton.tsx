import { useAppSelector } from "@store/hooks";
import "./secondaryButton.scss";

const SecondaryButton = ({
  Title,
  onClick,
  className,
  disabled,
  icon,
  backgroundColor,
}: {
  Title: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  backgroundColor?: string;
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <button
      type="button"
    style={{backgroundColor:backgroundColor, borderColor:backgroundColor}}
      className={`${themeSelect} SecondaryButtonContainer ${
        disabled ? "disable" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {Title}
    </button>
  );
};

export default SecondaryButton;
