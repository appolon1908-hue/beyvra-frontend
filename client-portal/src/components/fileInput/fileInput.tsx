import React, { useState } from 'react';
import type { UploadProps } from 'antd';
import { message, Upload, Button, Progress } from 'antd';
import { FileAttatchment, FIleIcon } from 'assets/icons';
import './input.scss';

const { Dragger } = Upload;

interface FileInputProps {
  handleChange: (file: FormData) => void;
}

const FileInput: React.FC<FileInputProps> = ({ handleChange }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); 
  const [isSizeLimitExceeded, setIsSizeLimitExceeded] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string, size: number } | null>(null);

  console.log(uploadProgress)
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    
    beforeUpload(file) {
      const fileSizeMB = file.size / 1024 / 1024; 
      if (fileSizeMB > 2) {
        setIsSizeLimitExceeded(true);
        message.error(`File size exceeds 3MB. File size: ${Math.round(fileSizeMB)}MB`);
        return false; 
      }

      setIsSizeLimitExceeded(false);
      simulatedUpload(file);

      const formData = new FormData();
      formData.append("file", file);
      handleChange(formData);
      setFileInfo({ name: file.name, size: Math.round(file.size / 1024) }); 
      return false; 
    },
    
    
  };

  const onRemove = () => {
    handleChange(new FormData);
    setFileInfo(null); 
    setUploadProgress(0);
    console.log(uploadProgress, "remove")

    
  }

  const simulatedUpload = (file: File) => {
    const fileSizeKB = Math.round(file.size / 1024);

    const totalSize = fileSizeKB;
    const uploadSpeed = 1000; 
    const updateIntervals = 100; // ms

    let progress = 0;


    const interval = setInterval(() => {
      if (progress < 100) {
        progress += (uploadSpeed * (updateIntervals / 1000)) / totalSize * 100;
        setUploadProgress(Math.min(progress, 100));
      } else {
        clearInterval(interval);
        setUploadProgress(100);
        message.success(`${file.name} file uploaded successfully.`);
      }
    }, updateIntervals);


    setUploadProgress(100)
  };

  return (
    <div className="fileInput max-w-lg">
      {fileInfo && !isSizeLimitExceeded ? (
        <>
        <div className='progress-wrapper border-2 border-[#0094FF]'>
          <div className='text-wrap bg-red-0 flex gap-5 items-center'>
            <p className="ant-upload-drag-icon">
              <FIleIcon />
            </p>
            <div>
              <p className='text-[#A3A8B0] flex-1 break-words text-wrap max-w-sm text-ellipsis whitespace-nowrap overflow-hidden'>
                {fileInfo.name.substring(0, 70)}
              </p>
              <p className='text-[#A3A8B0]'>
                {fileInfo.size}KB
              </p>
            </div>
          </div>
          <div className='text-wrap ant-upload-text h-2 flex-1 my-2'>
            {uploadProgress != null && (

            <Progress
              percent={Math.round(uploadProgress)}
              status="active"
              showInfo={true}
              strokeColor="#1890ff"
            />
          )}

          </div>
       
        </div>
           <div className='mt-2 flex justify-between items-center'>
            <span className='text-[#0094FF]'>
            Change File

            </span>
            <span className='text-[#E03137]'  onClick={onRemove}>
              Remove file
            </span>
          </div>
        </>
      ) : isSizeLimitExceeded ? (
        <div>
          <Dragger
            style={{ border: "2px dashed red" }}
            className='fail'
            {...props}
          >
            <div>
              <p className="ant-upload-drag-icon">
                <FileAttatchment />
              </p>
              <div className="text-wrap">
                <p className="ant-upload-text text-white text-left">
                  Attach or drag/drop your documents
                </p>
                <p className="ant-upload-hint text-white text-left">
                  .PDF, .DOCX, PNG, JPG (max. 3MB)
                </p>
              </div>
            </div>
          </Dragger>
          <p className="text-red-500 max-w-sm">The file size is too big. Please, upload
          a maximum 2 MB size.</p>
        </div>
      ) : (
        <Dragger
          {...props}
        >
          <div>
            <p className="ant-upload-drag-icon">
              <FileAttatchment />
            </p>
            <div className="text-wrap">
              <p className="ant-upload-text font-medium text-base text-white text-left">
                Attach or drag/drop your documents
              </p>
              <p className="ant-upload-hint text-white text-left">
                .PDF, .DOCX, PNG, JPG (max. 3MB)
              </p>
            </div>
          </div>
        </Dragger>
      )}
    </div>
  );
};

export default FileInput;
