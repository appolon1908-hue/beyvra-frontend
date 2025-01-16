import { Dispatch, SetStateAction, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { UserSliceState, setUser } from "@store/slices/user";
import useUpdateUser from "api/user/useUpdateUser";

import Input from "../../../../../components/input/Input";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import "./editName.scss";
import { RightSubDrawerContent } from "../../types";
import { InfoCircleIcon } from "../../../../../assets/icons";

interface EditNameProps {
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const EditName: React.FunctionComponent<EditNameProps> = ({
  setIsRightSubDrawerContent,
}) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);

  const { user } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { mutate, isPending } = useUpdateUser({
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast.success("You name has been updated.");
      setIsRightSubDrawerContent("settings");
    },
  });

  const [username, setUsername] = useState(user?.first_name);

  const onUpdateName = () => {
    mutate({
      data: {
        first_name: username,
      },
      token: cookies.access_token,
    });
  };

  return (
    <div className="editNameMenu">
      <Input
        placeholder="Name"
        title="Name"
        defaultValue={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        suffixIcon={<InfoCircleIcon />}
      />
      <MenuListCard
        disabled={!!(user?.first_name == username) || isPending}
        variant={2}
        textCenter
        title="Save name"
        onClick={onUpdateName}
      />
    </div>
  );
};

export default EditName;
