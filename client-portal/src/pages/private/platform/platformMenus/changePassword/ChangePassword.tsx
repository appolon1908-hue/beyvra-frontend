import { Dispatch, SetStateAction, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm, Controller } from "react-hook-form";

import useChangePassword, {
  ChangePasswordForm,
} from "api/user/useChangePassword";
import Input from "components/input/Input";
import "./changePassword.scss";
import StrengthMeter from "./StrengthMeter";

import { RightSubDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";

interface ChangePasswordProps {
  setIsRightSubDrawerOpen?: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent?: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const ChangePassword: React.FunctionComponent<ChangePasswordProps> = ({
  setIsRightSubDrawerContent,
}) => {
  const [cookies] = useCookies(["access_token"]);
  const { handleSubmit, watch, control, formState } =
    useForm<ChangePasswordForm>({
      defaultValues: {
        old_password: "",
      },
    });
  const { errors } = formState;

  const newPass = watch("new_password");

  const { mutate, isPending } = useChangePassword({
    onSuccess: () => {
      if (setIsRightSubDrawerContent) {
        setIsRightSubDrawerContent("password-success");
      }
    },
  });

  const onSubmit = (data: ChangePasswordForm) =>
    mutate({ token: cookies.access_token, formData: data });

  useEffect(() => {
    console.log({ errors });
  }, [errors]);

  return (
    <div className={`changePassword  m-auto max-w-3xl`}>
      <form
        className="forgotPassContainer w-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Controller
            name="old_password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                id="old_password"
                title="Old Password"
                type="password"
                placeholder="Enter old password"
              />
            )}
          />
          <p className="error_msg">
            {errors.old_password?.type === "required" &&
              "Old password is required."}
          </p>
        </div>

        <div>
          <Controller
            name="new_password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                title="New Password"
                type="password"
                placeholder="Enter new password"
              />
            )}
          />
          <p className="error_msg">
            {errors.new_password?.type === "required" &&
              "New password is required."}
          </p>
        </div>

        <div>
          <Controller
            name="new_password_confirm"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                title="Confirm New Password"
                type="password"
                placeholder="Confirm password"
              />
            )}
          />
          <p className="error_msg">
            {errors.new_password_confirm?.type === "required" &&
              "Confirm password is required."}
          </p>
        </div>

        <StrengthMeter password={newPass} />
        <PrimaryButton
          className="changePwButton"
          Title="Change Password"
          htmlType="submit"
          loading={isPending}
        />
      </form>
    </div>
  );
};

export default ChangePassword;
