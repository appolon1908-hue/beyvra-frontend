import React from "react";
import MainItemCard from "../mainItemCard/MainItemCard";
import "./menuListCard.scss";
import { useAppSelector } from "@store/hooks";

interface MenuListCardProps {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  danger?: boolean;
  textCenter?: boolean;
  subTextCenter?: boolean;
  onClick?: () => void;
  className?: string;
  primary?: boolean;
  disabled?: boolean;
  customContent?: React.ReactNode;
  variant?: 1 | 2 | 3;
  suffix?: React.ReactNode;
}

const MenuListCard: React.FC<MenuListCardProps> = ({
  icon,
  title,
  subtitle,
  danger,
  textCenter,
  subTextCenter,
  onClick,
  className,
  primary = false,
  disabled = false,
  customContent,
  variant = 2,
  suffix,
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <MainItemCard
      className={`menuListCard ${themeSelect} ${danger ? "danger" : ""} ${
        className ? className : ""
      }`}
      variant={variant}
      onClick={onClick}
      primary={primary}
      pointer={!disabled}
    >
      {icon ? (
        <div
          className={`cardLeftIcon ${textCenter ? "textCenter" : ""} ${
            disabled ? "disabled" : ""
          }`}
        >
          {icon}
        </div>
      ) : null}
      {customContent ? (
        customContent
      ) : (
        <div className="cardRightContent">
          {title && (
            <p
              className={`
            menuListCardTitle
            ${!subtitle && "noMargin"}
            ${danger ? "danger" : ""}
            ${disabled ? "disabled" : ""}
            ${textCenter ? "textCenter" : ""}`}
            >
              {title}
            </p>
          )}
          {subtitle && (
            <p
              className={`
            menuListCardSubtitle
            ${subTextCenter ? "subTextCenter" : ""}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {suffix ? (
        <div className={`cardRightSuffix ${disabled ? "disabled" : ""}`}>
          {suffix}
        </div>
      ) : null}
    </MainItemCard>
  );
};

export default MenuListCard;
