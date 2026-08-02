import { Button, Modal, Typography } from "antd";
import { FC, useState } from "react";
import ArrowsSlider from "../../../../../components/arrowsSlider/ArrowsSlider";
import "./PaymentMethod.scss";
import { useDispatch } from "react-redux";
import { setPaymentMethod } from "@store/slices/payment";
import { useAppSelector } from "@store/hooks";

interface PaymentMethodProps {
  isModalOpen: any
  setIsModalOpen: any
  setIsCryptoPaymentsModalOpen: any
}

const PaymentMethod: FC<PaymentMethodProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsCryptoPaymentsModalOpen
}) => {
  const dispatch = useDispatch();
  const { paymentMethodList, selectedPaymentMethod } = useAppSelector((state) => state.payment);
  const [paymentType, setPaymentType] = useState<string>("all");

  const titleHandler = (titleKey: string) => {
    switch (titleKey) {
      case "bank":
        return "Bank Cards";
      case "epayment":
        return "E-Payment Systems";
      case "crypto":
        return "Crypto";
      default:
        return "All";
    }
  };

  const { themeSelect } = useAppSelector(state => state.themeBg);
  const paymentMethodListWithAll = [
    { type: "all" },
    ...(paymentMethodList || []),
  ];
  const allPaymentMethods = paymentMethodList || [];
  const filteredPaymentMethods = (paymentMethodList || []).filter(
    (method) => paymentType === "all" || method.type === paymentType
  );

  // Group payment methods by their type
  const groupedPaymentMethods = filteredPaymentMethods?.reduce<{ [type: string]: any[] }>(
    (groups, item) => {
      const group = groups[item.type] || [];
      group.push(item);
      groups[item.type] = group;

      return groups;
    },
    {}
  );

  console.log("My log", paymentMethodList);

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={''}
      centered
    >
      <div className={themeSelect}>
        <div className="payment-methods-title">
          Select Payment Method
        </div>
        <div className="payment-methods-filter-btns">
          <ArrowsSlider>
            {
              paymentMethodListWithAll?.map((paymentMethods) => {
                return (
                  <Button
                    className="payment-methods-filter-btn"
                    key={paymentMethods.type}
                    onClick={() => setPaymentType(paymentMethods.type)}
                  >
                    {titleHandler(paymentMethods.type)}
                  </Button>
                )
              })}
          </ArrowsSlider>
        </div>
        <div>
          <div>
            {
              paymentType === 'all' && (
                <div className="payment-method-list">
                  <Typography.Text className="payment-method-list-title">
                    {titleHandler("all").toUpperCase()}
                  </Typography.Text>
                  {allPaymentMethods?.map((item, index) => item.icon && item.name && (
                    <div
                      className={`payment-method-list-item ${selectedPaymentMethod?.name === item?.name ? 'active-payment-method-list-item' : ''
                        }`}
                      key={`${index}-${item.name}`}
                      onClick={() => {
                        setIsModalOpen(false);
                        if (item.type === "crypto") {
                          setIsCryptoPaymentsModalOpen(true);
                        }
                        dispatch(setPaymentMethod(item));
                      }}
                    >
                      <img src={item.icon} alt={item.name} style={{ width: 50, height: 50 }} />
                      <Typography.Text style={{ color: "#FFFFFF" }}>{item.name}</Typography.Text>
                    </div>
                  ))}
                </div>
              )
            }
            {Object.entries(groupedPaymentMethods || {})
              .filter(([type]) => type !== "all")
              .map(([type, items]) => (
                <div key={type} className="payment-method-list">
                  <Typography.Text className="payment-method-list-title">
                    {titleHandler(type).toUpperCase()}
                  </Typography.Text>
                  {items.map((item, index) => (
                    <div
                      className={`payment-method-list-item ${selectedPaymentMethod?.name === item?.name ? 'active-payment-method-list-item' : ''
                        }`}
                      key={`${index}-${item.name}`}
                      onClick={() => {
                        setIsModalOpen(false);
                        if (item.type === "crypto") {
                          setIsCryptoPaymentsModalOpen(true);
                        }
                        dispatch(setPaymentMethod(item));
                      }}
                    >
                      <img src={item.icon} alt={item.name} style={{ width: 50, height: 50 }} />
                      <Typography.Text style={{ color: "#FFFFFF" }}>{item.name}</Typography.Text>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethod;
