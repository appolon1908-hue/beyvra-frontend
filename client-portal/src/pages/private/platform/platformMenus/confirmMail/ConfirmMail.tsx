import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import useSendEmailVerification from "api/user/useSendEmailVerification";

import { InfoCircleIcon } from "../../../../../assets/icons";
import Input from "../../../../../components/input/Input";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import "./confirmMail.scss";

interface ConfirmMailProps {}

const ConfirmMail: React.FunctionComponent<ConfirmMailProps> = () => {
  const [cookies] = useCookies(["access_token"]);
  const [emailSent, setEmailSent] = useState(false);

  const { user } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { mutate, isPending } = useSendEmailVerification({
    onSuccess: (data) => {
      toast.success(data.detail);
      setEmailSent(true);
    },
  });

  const [email, setEmail] = useState(user?.blured_email);

  const onSendVerification = () => {
    mutate(cookies.access_token);
  };

  return (
    <div className="confirmMailMenu">
      <Input
        disabled={false}
        placeholder="Enter your email"
        title="Email"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        suffixIcon={<InfoCircleIcon />}
      />

      <MenuListCard
        disabled={user?.email_verified || isPending || emailSent}
        textCenter
        title="Confirm"
        onClick={onSendVerification}
      />
    </div>
  );
};

export default ConfirmMail;
