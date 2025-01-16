import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import './pic.scss';

type FileType = NonNullable<UploadFile['originFileObj']>;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type ProfilePicProps = {
  handleProfileImg: (file: File) => void;
  profilePic: string | null;
};

const ProfilePic: React.FC<ProfilePicProps> = ({ handleProfileImg, profilePic }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(profilePic || '');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (profilePic) {
      setPreviewImage(profilePic);
      setFileList([{ uid: '-1', url: profilePic, name: 'profile-picture' }]); // Simulate an existing file in the list
    }
  }, [profilePic]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const latestFile = newFileList[newFileList.length - 1];
      if (latestFile.originFileObj) {
        handleProfileImg(latestFile.originFileObj);
        setPreviewImage(URL.createObjectURL(latestFile.originFileObj));
      }
    }
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // Prevent the upload
    return false;
  };

  const uploadButton = (
    <div>
      <PlusOutlined className='text-white' />
      <div className='uploadText'>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          height={'10px'}
          width={'10px'}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ProfilePic;
