import { Col, Row, Typography, Form, Button } from "antd";

import "./CardDetailsMenu.scss";
import { PaymentIcon, SecureIcon } from "../../../../../assets/icons";
import DepositInput from "../../../../../components/depositInput/DepositInput";

import { Dispatch, FC, SetStateAction, useReducer } from "react";
import { RightSubDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { useAppSelector } from "@store/hooks";
import { useForm } from "react-hook-form";
import IBankCardPaymentForm from "@interfaces/IBankCardPaymentForm";
import {CreditCardCVVInput, CreditCardExpiryDate, CreditCardNumberInput} from "components/creditCardNumberInput/CreditCardNumberInput";

interface CardDetailsMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}
const CardDetailsMenu: FC<CardDetailsMenuProps> = ({
  // setIsRightSubDrawerOpen,
  // setIsRightSubDrawerContent,
}) => {
  const { amount, selectedPaymentMethod } = useAppSelector((state) => state.payment);
  const { handleSubmit, register } = useForm<IBankCardPaymentForm>();
  const initialState = {
    errors: {},
    cardDetails: {
        cvc: '',
        cardNumber: '',
        cardholderName: '',
        expiryDate: ''
    },
    loading: false
};
  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), initialState);
  const { errors, cardDetails, loading } = state;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState({
      cardDetails: {
          ...cardDetails,
          [name]: value
      },
      errors: {
          ...errors,
          [name]: ''
      }
  });
  }
  const onSubmit = handleSubmit((data) =>
    console.log(data)
    // mutate({
    //   uidb64,
    //   token,
    //   data,
    // })
  );

  return (
    <div className="card-details">
       <Form layout="vertical" onFinish={onSubmit}>
          <Typography.Text className="deposit-subtext">
            USD Account #65715654
          </Typography.Text>
          <div className="hr" />
          <div className="payment-amount-info">
            <PaymentIcon />
            <div className="payment-text">
              <Typography.Text className="payment-subtext">
                Payment Amount
              </Typography.Text>
              <Typography.Text className="payment-amount">USD {amount}</Typography.Text>
            </div>
          </div>
        
            <Form.Item
              name="cardNumber"
              rules={[{ required: true, message: "Card number required" }]}
            > 
              <CreditCardNumberInput
                placeholder="Card Number" 
                type="pattern" 
                onChange={handleInputChange}
                name="cardNumber"
                inputValue={cardDetails?.cardNumber}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="expiryDate"
                  rules={[{ required: true, message: "Expiry date required" }]}
                > 
                  <CreditCardExpiryDate
                    placeholderColor 
                    placeholder="MM/YY"
                    onChange={handleInputChange}
                    name="expiryDate"
                    inputValue={cardDetails?.expiryDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cvc"
                  rules={[{ required: true, message: "Card cvc required" }]}
                > 
                  <CreditCardCVVInput
                    placeholderColor 
                    type="pattern" 
                    placeholder="CVV/CVC" 
                    onChange={handleInputChange}
                    name="cvc"
                    inputValue={cardDetails?.cvc}
              
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="cardholderName"
                  rules={[{ required: true, message: "Name required" }]}
                > 
                  <DepositInput
                    placeholderColor
                    type="text"
                    onChange={handleInputChange}
                    placeholder="Cardholder Name"
                    name="cardholderName"
                    value={cardDetails?.cardholderName}
                    format=""
                  />
                </Form.Item>
              </Col>
            </Row>
          
          <div className="card-details-description-main">
            <Typography.Text className="card-details-description">
              Enter your full name as it is written on the card. If the card has no
              name, enter your dull legal name.
            </Typography.Text>
          </div>
          <div className="deposit-secure">
            <SecureIcon />
            <Typography.Text className="deposit-secure-text">
              This is a secure 128-bit encrypted payment.
            </Typography.Text>
          </div>
          <PrimaryButton
            // onClick={() => {
            //   setIsRightSubDrawerOpen(true);
            //   setIsRightSubDrawerContent("deposit-confirm-payment");
            // }}
            htmlType="submit"
            // onClick={undefined}
            className="deposit-button"
            Title={`Pay USD ${amount}`}
          />
      </Form>
    </div>
  );
};

export default CardDetailsMenu;
