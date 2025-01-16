import React from "react";
import "./PaymentListItemCard.scss";

interface PaymentListItemCardProps {
  icon?: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  customContent?: React.ReactNode;
  border?: boolean;
}

const PaymentListItemCard: React.FC<PaymentListItemCardProps> = ({
  icon,
  title,
  onClick,
  className,
  disabled = false,
  customContent,
  border,
}) => {
  return (
    <div
      onClick={onClick}
      className={`PaymentsMainItemCard 
       ${!disabled ? "" : "none-pointer"}`}
    >
      <div
        className={`paymentListItemCard ${border ? "border" : ""} ${
          className ? className : ""
        }`}
      >
        {icon ? (
          <div className={`cardLeftIcon  ${disabled ? "disabled" : ""}`}>
            {icon}
          </div>
        ) : null}
        {customContent ? (
          customContent
        ) : (
          <div className="cardRightContent">
            {title && <p className=" menuListCardTitle">{title}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentListItemCard;
