import { Form, Typography } from "antd";
import Input from "../../../../../components/input/Input";
import "./accountRename.scss";
import { Dispatch, SetStateAction, useEffect, useReducer } from "react";
import { RightDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { useAppSelector } from "@store/hooks";
import { setEditableWallet, updateWalletsArray, WalletSliceState } from "@store/slices/wallet";
import { useCookies } from "react-cookie";
import useUpdateWallet from "api/wallet/useUpdateWallet";
import { useDispatch } from "react-redux";

interface AccountRenameProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightDrawerContent: Dispatch<SetStateAction<RightDrawerContent>>;
}

const AccountRename: React.FunctionComponent<AccountRenameProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightDrawerContent,
}) => {
  const { editableWallet } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );
  const dispatch = useDispatch();
  const [cookies] = useCookies(["access_token"]);
  const initialState = {
    formData: {
      name: editableWallet?.name
    },
    errors: {}
  };
  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), initialState);
  const { formData } = state;

  const { mutate, isPending } = useUpdateWallet({
    onSuccess: (data) => {
      const { wallet } = data;
      dispatch(updateWalletsArray(wallet));
      dispatch(setEditableWallet({}));
      setIsRightSubDrawerOpen(false);
      setIsRightDrawerContent("account");
    },
    onError: (error) => { },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setState({
      formData: {
        ...formData,
        [name]: value
      }
    })
  };

  const handleOnSubmit = () => {
    mutate({
      data: { name: formData?.name, is_archived: false },
      id: editableWallet?.id,
      token: cookies.access_token,
    });
  };


  useEffect(() => {
    setState({
      formData: {
        ...formData,
        name: editableWallet?.name
      }
    })

  }, []);
  return (
    <div className="editNameMenu">
      <Typography.Text className="editNameMenu-text">
        Edit the account name. This is how it will be displayed on the list of
        your accounts.
      </Typography.Text>
      <Form layout="vertical" onFinish={handleOnSubmit}>
        {/* <Form.Item
          name="name"
          rules={[{ required: true, message: "Account name required" }]}
        >  */}
        <Input
          placeholder="Account Name"
          title="Account Name"
          name="name"
          onChange={handleInputChange}
          defaultValue={editableWallet?.name}
          value={formData?.name}
          type="text"
        />
        {/* </Form.Item> */}
        <PrimaryButton
          Title="Confirm"
          htmlType="submit"
          loading={isPending}
        // onClick={() => {
        //   setIsRightSubDrawerOpen(false);
        //   setIsRightDrawerContent("account");
        // }}
        />

      </Form>

    </div>
  );
};

export default AccountRename;
