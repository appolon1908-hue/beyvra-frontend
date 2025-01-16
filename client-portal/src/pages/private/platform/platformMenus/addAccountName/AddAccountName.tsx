import { Dispatch, SetStateAction, useState } from "react";
import { Typography, Form } from "antd";
import Input from "../../../../../components/input/Input";
import { RightDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useCookies } from "react-cookie";
import { WalletSliceState, setWallets } from "@store/slices/wallet";
import useCreateWallet from "api/wallet/useCreateWallet";
import { IWallet } from "@interfaces";

interface AddAccountNameProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightDrawerContent: Dispatch<SetStateAction<RightDrawerContent>>;
}

const AddAccountName: React.FunctionComponent<AddAccountNameProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightDrawerContent,
}) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);
  const [name, setName] = useState("");

  const { wallets,walletTypes, createWalletData } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );

  const { mutate, isPending } = useCreateWallet({
    onSuccess: (data:any) => {
      setIsRightSubDrawerOpen(false);
      setIsRightDrawerContent("account");
      console.log(wallets,data);
      console.log(walletTypes);
      console.log(walletTypes.filter((item)=>item.id == data.currency));
      console.log();
      const updatedWalletData = {
        ...data,  
        currency: walletTypes.find((item)=>item.id == data.currency)  // Update the currency attribute
      };
      dispatch(setWallets([ updatedWalletData,...wallets]));
    },
    onError: (error) => {
      console.log("fetching wallets error", error);
    },
  });

  const onCreateWallet = () => {
    mutate({
      data: { ...createWalletData, name  },
      token: cookies.access_token,
    });
  };

  return (
    <div className="editNameMenu">
      <Typography.Text className="editNameMenu-text">
        Set the account name. This is how it will be displayed on the list of
        your accounts.
      </Typography.Text>
      <Form layout="vertical" onFinish={onCreateWallet}>
        
        <Form.Item
          name="accountName"
          rules={[{ required: true, message: "Account name is required" }]}
        >
          <Input
            placeholder="Account Name"
            title="Account Name"
            name="accountName"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
        </Form.Item>
        
        <PrimaryButton
          Title="Create Account"
          htmlType="submit"
          backgroundColor="#28bd66"
          // onClick={onCreateWallet}
          loading={isPending}
          disabled={isPending}
        />
      </Form>
    </div>
  );
};

export default AddAccountName;
