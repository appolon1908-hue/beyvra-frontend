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

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false, // Hide the default file list
    
    beforeUpload(file) {
      const fileSizeMB = file.size / 1024 / 1024; 
      if (fileSizeMB > 3) {
        setIsSizeLimitExceeded(true);
        message.error(`File size exceeds 3MB. File size: ${Math.round(fileSizeMB)}MB`);
        return false; 
      }

      setIsSizeLimitExceeded(false);
      simulatedUpload(file);

      const formData = new FormData();
      formData.append("file", file);
      handleChange(formData);
      setFileInfo({ name: file.name, size: Math.round(file.size / 1024) }); // Set file info
      return false; // Prevent the default behavior of uploading the file immediately
    },
    
    onRemove: () => {
      setFileInfo(null); // Clear file info on removal
    }
  };

  const simulatedUpload = (file: File) => {
    const fileSizeKB = Math.round(file.size / 1024);
    console.log("Starting simulated upload");

    const totalSize = fileSizeKB;
    const uploadSpeed = 600; // KB/s
    const updateIntervals = 100; // ms

    let progress = 0;

    if (fileSizeKB > 3000) {
      message.error("File size exceeds 3MB");
      setIsSizeLimitExceeded(true);
      return; // Exit the function to avoid simulating upload for oversized files
    }

    const interval = setInterval(() => {
      if (progress < 100) {
        progress += (uploadSpeed * (updateIntervals / 1000)) / totalSize * 100;
        setUploadProgress(Math.min(progress, 100));
      } else {
        clearInterval(interval);
        setUploadProgress(null);
        message.success(`${file.name} file uploaded successfully.`);
      }
    }, updateIntervals);
  };

  return (
    <div className="fileInput max-w-md">
      {fileInfo && !isSizeLimitExceeded ? (
        <div className='progress-wrapper border-2 border-[#0094FF]'>
          <div className='text-wrap flex gap-5 items-center'>
            <p className="ant-upload-drag-icon">
              <FIleIcon />
            </p>
            <div>
              <p className='text-[#A3A8B0] flex-1 break-words text-wrap max-w-sm text-ellipsis whitespace-nowrap overflow-hidden'>
                {fileInfo.name}
              </p>
              <p className='text-[#A3A8B0]'>
                {fileInfo.size}KB
              </p>
            </div>
          </div>
          <div className='text-wrap ant-upload-text h-2 flex-1 my-2'>
            <Progress
              percent={Math.round(uploadProgress)}
              status="active"
              showInfo={true}
              strokeColor="#1890ff"
            />
          </div>
          <Button onClick={() => setFileInfo(null)} className='mt-2'>
            Change File
          </Button>
        </div>
      ) : isSizeLimitExceeded ? (
        <div>
          <Dragger
            style={{ border: "1px dashed red" }}
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
          <p className="text-red-500">The file size is too big</p>
        </div>
      ) : (
        <Dragger
          style={{ border: "1px dashed grey" }}
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
      )}
    </div>
  );
};

export default FileInput;
