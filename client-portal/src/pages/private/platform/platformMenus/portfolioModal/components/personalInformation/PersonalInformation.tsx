import React from 'react'
import './personalInfo.scss'
import { useAppSelector } from '@store/hooks'
import { useNavigate } from 'react-router-dom'

const ProfileInformation: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAppSelector(state => state.user)

    return (
        <div className='relative personal-info-detail'>

            <h4 className='areatitle'>Personal Information</h4>
            <div className='personal-info-input-container'>
                <div className='flex-1 border rounded-lg py-2 px-3'>
                    <h5 className='text-sm font-semibold text-gray-400'>First Name</h5>
                    <p className='text-sm font-normal'>   {`${user?.first_name} `}</p>

                </div>
                <div className='flex-1  border rounded-lg py-2 px-3'>
                    <h5 className='text-sm font-semibold text-gray-400'>Last Name</h5>
                    <p className='text-sm font-normal'>   {` ${user?.last_name}`}</p>
                </div>
            </div>
            <div className='personal-info-input-container'>
                <div className='flex-1  border rounded-lg py-2 px-3'>
                    <h5 className='text-sm font-semibold text-gray-400'>E-mail</h5>
                    <p className='text-sm font-normal'>{`${user?.email}`}</p>
                </div>
                <div className='flex-1  border rounded-lg py-2 px-3'>
                    <h5 className='text-sm font-semibold text-gray-400'>Phone Number</h5>
                    <p className='text-sm font-normal'>{`${user?.phone_number}`}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation