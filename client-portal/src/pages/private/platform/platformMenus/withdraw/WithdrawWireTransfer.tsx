import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../../../../components/input/EmptyInput";
import "./withdrawMenu.scss";
import { Row } from "antd";
import PrimaryButton from "components/primaryButton/PrimaryButton";
import { useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { useState } from "react";
import { IWalletType } from "@interfaces";
import useWithdrawWireTransfer from "api/bank/useWithdrawWireTransfer";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

// Defined validation schema for input fields
const validationSchema = Yup.object({
  amount: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
  bank_name: Yup.string().required("This field is required"),
  account_number: Yup.string().required("This field is required"),
  account_holder_name: Yup.string().required("This field is required"),
  first_name: Yup.string().required("This field is required"),
  last_name: Yup.string().required("This field is required"),
  iban: Yup.string().required("This field is required"),
  country: Yup.string().required("This field is required"),
});

const WithdrawWireTransfer = () => {
  const [isSubmitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["access_token"]);
  const userRedux = useAppSelector(
    (state: { user: UserSliceState }) => state.user.user
  );
  const walletTypes = useAppSelector(
    (state) => state.wallet.walletTypes
  );
  const [currency, setCurrency] = useState<IWalletType | null>(null);
  const userData =
    userRedux && Object.keys(userRedux).length ? userRedux : null;

  const { mutate } = useWithdrawWireTransfer({
    onSuccess: () => {
      formik.resetForm();
      setCurrency(null);
      setSubmitClicked(false);
      toast.success('Request submitted successfully.');
    },
    onError: (error) => {
      console.log('##Error:: ', error);
      toast.error('Failed to submit the record');
    },
  });

  // Initializes Formik
  const formik = useFormik({
    initialValues: {
      "amount": "",
      "description": "",
      "bank_name": "",
      "account_number": "",
      "account_holder_name": "",
      "first_name": "",
      "last_name": "",
      "iban": "",
      "country": ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        "withdrawal_request": {
          "amount": values.amount,
          "currency": currency?.id,
          "description": values.description,
        },
        "bank_name": values.bank_name,
        "account_number": values.account_number,
        "account_holder_name": values.account_holder_name,
        "first_name": values.first_name,
        "last_name": values.last_name,
        "routing_number": 'N/A',
        "swift_code": 'N/A',
        "iban": values.iban,
        "country": values.country,
      }
      setLoading(true);
      mutate({
        data,
        token: cookies.access_token
      });
    },
  });

  return (
    <div className="withdrawWireTransferContainer">
      <div className="withdrawTitle">Withdraw: Wire Transfer</div>
      <div className="trader">
        <div className="traderHead">
          {userData?.first_name} {userData?.last_name}
        </div>
        <div className="traderBottom">
          <span className="id">{'ID: '}</span>
          <span className="id-number">{userData?.trader_id}</span>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="inputsContainer">
          
          <div className="trader">
            <label className="inputLebel">
              First Name
            </label>
            <div className="inputInput">
              <Input
                className={`${isSubmitClicked && formik.errors.first_name ? "inputError" : ""
                  }`}
                variant={2}
                title="First Name"
                {...formik.getFieldProps("first_name")}
              />
              {isSubmitClicked && formik.errors.first_name ? (
                <p>{formik.errors.first_name}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Last Name
            </label>
            <div className="inputInput">
                <Input
                className={`${isSubmitClicked && formik.errors.last_name ? "inputError" : ""
                  }`}
                variant={2}
                title="Last Name"
                {...formik.getFieldProps("last_name")}
              />
              {isSubmitClicked && formik.errors.last_name ? (
                <p>{formik.errors.last_name}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Bank Name
            </label>
            <div className="inputInput">
            <Input
            className={`${isSubmitClicked && formik.errors.bank_name ? "inputError" : ""
              }`}
            variant={2}
            title="Bank Name"
            {...formik.getFieldProps("bank_name")}
          />
          {isSubmitClicked && formik.errors.bank_name ? (
            <p>{formik.errors.bank_name}</p>
          ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Account Holder Name
            </label>
            <div className="inputInput">
              <Input
                className={`${isSubmitClicked && formik.errors.account_holder_name ? "inputError" : ""
                  }`}
                variant={2}
                title="Account Holder Name"
                {...formik.getFieldProps("account_holder_name")}
              />
              {isSubmitClicked && formik.errors.account_holder_name ? (
                <p>{formik.errors.account_holder_name}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              IBAN
            </label>
            <div className="inputInput">
            <Input
                className={`${isSubmitClicked && formik.errors.iban ? "inputError" : ""
                  }`}
                variant={2}
                title="IBAN"
                {...formik.getFieldProps("iban")}
              />
              {isSubmitClicked && formik.errors.iban ? (
                <p>{formik.errors.iban}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Country
            </label>
            <div className="inputInput">
              <Input
                className={`${isSubmitClicked && formik.errors.country ? "inputError" : ""
                  }`}
                variant={2}
                title="Country"
                {...formik.getFieldProps("country")}
              />
              {isSubmitClicked && formik.errors.country ? (
                <p>{formik.errors.country}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Amount
            </label>
            <div className="inputInput">
            <Input
                className={`${isSubmitClicked && formik.errors.amount ? "inputError" : ""
                  }`}
                variant={2}
                title="Amount"
                {...formik.getFieldProps("amount")}
              />
              {isSubmitClicked && formik.errors.amount ? (
                <p>{formik.errors.amount}</p>
              ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Currency
            </label>
            <div className="inputInput">
            
          <DropdownMenu position="top dropdown-position-fixed withdrawWireTransferDropDownCurrency" type="drop-down" menuItems={walletTypes.map((item) => {
            return {
              text: item.symbol,
              onclick: () => { setCurrency(item) },
            };
          })}
          >
            <Input
              variant={2}
              title="Currency"
              disabled
              textOnly
              value={currency?.symbol}
            />
          </DropdownMenu>
          {isSubmitClicked && !currency ? (
            <p>{'Currency is required'}</p>
          ) : null}
            </div>
          </div>

          <div className="trader">
            <label className="inputLebel">
              Purpose/Description
            </label>
            <div className="inputInput">
              <Input
                className={`${isSubmitClicked && formik.errors.description ? "inputError" : ""
                  }`}
                variant={2}
                title="Purpose/Description"
                {...formik.getFieldProps("description")}
              />
              {isSubmitClicked && formik.errors.description ? (
                <p>{formik.errors.description}</p>
              ) : null}
            </div>
          </div>

          
          <Row gutter={15} className="buttonsRow">
            <PrimaryButton
              Title="Submit"
              className="SelectAccountButton"
              loading={loading}
              onClick={() => {
                setSubmitClicked(true);
                currency && formik.handleSubmit();
              }}
            />
          </Row>
        </div>
      </form>
    </div>
  );
};

export default WithdrawWireTransfer;
