import { Dispatch, SetStateAction, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import useSendPhoneVerification from "api/user/useSendPhoneVerification";
import usePhoneVerify from "api/user/usePhoneVerify";

import { RightSubDrawerContent } from "../../types";
import { InfoCircleIcon } from "../../../../../assets/icons";
import Input from "../../../../../components/input/Input";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import "./confirmPhone.scss";

interface ConfirmPhoneProps {
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const ConfirmPhone: React.FunctionComponent<ConfirmPhoneProps> = ({
  setIsRightSubDrawerContent,
}) => {
  const [cookies] = useCookies(["access_token"]);

  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const { user } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { mutate, isPending } = useSendPhoneVerification({
    onSuccess: (data) => {
      toast.success(data.detail);
      setCodeSent(true);
    },
  });

  const { mutate: verifyCode, isPending: isVerifying } = usePhoneVerify({
    onSuccess: (data) => {
      toast.success(data.detail);
      setIsRightSubDrawerContent("personalSettings");
    },
  });

  const onSendCode = () => {
    mutate(cookies.access_token);
  };

  const onVerifyCode = () => {
    verifyCode({ data: { code }, token: cookies.access_token });
  };

  return (
    <div className="confirmPhoneMenu">
      <p className="sectionTitle">
        We do not spam call and do not impose hidden charges. A telephone number
        is only a necessary for the security of your account.
      </p>

      <Input
        disabled
        placeholder="Enter your phonenumber"
        title="Mobile phone number"
        defaultValue={user?.blured_phone_number}
        type="tel"
        suffixIcon={<InfoCircleIcon />}
      />

      {codeSent && (
        <>
          <p className="sectionTitle">
            We do not spam call and do not impose hidden charges. A telephone
            number is only a necessary for the security of your account.
          </p>
          <Input
            placeholder="Enter SMS code"
            title="SMS Code"
            defaultValue={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
          />
          <MenuListCard
            onClick={onVerifyCode}
            disabled={!code || isVerifying}
            textCenter
            title="Confirm"
          />
        </>
      )}

      {!codeSent && (
        <MenuListCard
          onClick={onSendCode}
          disabled={isPending || codeSent}
          textCenter
          title="Get the code"
        />
      )}
    </div>
  );
};

export default ConfirmPhone;
