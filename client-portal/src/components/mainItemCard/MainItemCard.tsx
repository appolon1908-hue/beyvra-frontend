import React from "react";
import "./mainItemCard.scss";

interface MainItemCardProps {
  variant?: 1 | 2 | 3;
  className?: string;
  fullHeight?: boolean;
  onClick?: () => void;
  pointer?: boolean;
  primary?: boolean;
}

const MainItemCard: React.FC<React.PropsWithChildren<MainItemCardProps>> = ({
  variant = 1,
  children,
  className,
  fullHeight,
  onClick,
  pointer = true,
  primary = false,
}) => {
  return variant === 1 ? (
    <div
      onClick={onClick}
      className={`mainItemCard ${primary ? "primary" : ""} ${
        fullHeight ? "fullHeight" : ""
      } ${pointer ? "" : "none-pointer"}`}
    >
      <div className={`mainItemCardContent ${className ? className : ""}`}>
        {children}
      </div>
    </div>
  ) : (
    <div
      onClick={onClick}
      className={`mainItemCardv2 ${primary ? "primary" : ""} ${
        variant === 3 ? "cardv3" : ""
      } ${fullHeight ? "fullHeight" : ""} ${pointer ? "" : "none-pointer"}`}
    >
      <div className={`mainItemCardv2Content ${className ? className : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default MainItemCard;
