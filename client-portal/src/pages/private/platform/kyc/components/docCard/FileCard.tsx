import { FIleIcon, See } from 'assets/icons'
import "./fileCard.scss"
import React from 'react'

interface fileCardProps {
    fileName: string,
    fileSize: number,
    status: "rejected" | "pending"| "approved"
}

const FileCard : React.FC<fileCardProps> = ({fileName, fileSize, status}) => {
  return (
    <div className={`${status} review-Wrapper w-full px-10 gap-3 `}>
            <p className="ant-upload-drag-icon">
              <FIleIcon />
            </p>
            <div className='bg-red max-w-[240px] flex-1'>
              <p className='text-[#A3A8B0] flex-1 break-words text-wrap max-w-sm text-ellipsis whitespace-nowrap overflow-hidden'>
                {fileName?.substring(0, 70)}
              </p>
              <p className='text-[#A3A8B0]'>
                {fileSize}KB
              </p>
            </div>
            <span>
                <See/>
            </span>
          
       
        </div>
  )
}

export default FileCard