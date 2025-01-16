import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { type UploadChangeParam } from "antd/es/upload";

import useUpdateUser from "api/user/useUpdateUser";
import Upload from "components/upload/Upload";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";

const UploadProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["access_token"]);

  const [uploadProfileImage, setUploadProfileImage] = useState<File | null>(
    null
  );

  const { mutate, isPending } = useUpdateUser({
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast.success("Profile picture updated.");
      setUploadProfileImage(null);
    },
  });

  const handleChange = (info: UploadChangeParam) => {
    if (info.file) {
      setUploadProfileImage(info.file as unknown as File);
    }
  };

  useEffect(() => {
    if (uploadProfileImage) {
      mutate({
        data: {
          profile_picture: uploadProfileImage,
        },
        token: cookies.access_token,
      });
    }
  }, [uploadProfileImage, mutate, cookies.access_token]);

  return (
    <Upload
      placeholder="Upload Profile Picture"
      onChange={handleChange}
      multiple={false}
      disabled={isPending}
      fileList={[]}
    />
  );
};

export default UploadProfile;
