import { Modal } from 'antd';
import './settingsProfile.scss'
import { useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import useSendPhoneVerification from 'api/user/useSendPhoneVerification';
import { useCookies } from 'react-cookie';
import usePhoneVerify from 'api/user/usePhoneVerify';
import { toast } from 'react-toastify';

const PhoneVerify = () => {
    const [show, setShow] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { user } = useAppSelector((state) => state.user);
    const [cookies] = useCookies(["access_token"]);

    const { mutate, isPending } = useSendPhoneVerification({
        onSuccess: () => {
            setShow(true);
        },
    });

    const { mutate: verifyCode, isPending: isVerifying } = usePhoneVerify({
        onSuccess: (data) => {
            toast.success(data.detail);
            setShow(false);
            setEnabled(true);

        },
        onError: (error) => {
            toast.error(error.detail);
        }
    });

    const onVerifyCode = () => {
        verifyCode({ data: { code: phoneNumber }, token: cookies.access_token });
    };


    useEffect(() => {
        user?.phone_verified && setEnabled(user?.phone_verified);
    }, [user?.phone_verified])

    return (
        <>
            {!enabled ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                        onClick={() => {
                            mutate(cookies.access_token)
                        }}
                        className="verifyEmailButton"
                    >
                        {isPending ? 'Loading...' : 'Get the code'}
                    </button>
                </div>
            )
                :
                (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <p>✔️ Phone number verified.</p>
                    </div>
                )}
            <Modal
                rootClassName='settingProfileModal'
                open={show}
                onOk={() => setShow(false)}
                onCancel={() => setShow(false)}
                footer={null}
                maskClosable={false}
                centered
            >
                <div className='confirmEmailContainer'>
                    <span className='confirmEmailTitle'>Confirm your phone number</span>
                    <span className='confirmEmailSubTitle'>Enter your phone number</span>
                    <span className='confirmEmailNote'>We do not spam call and do not impose hidden charges. A telephone number is only a necessary for the security of your account.</span>

                    <div className='confirmEmailInputCotainer'>
                        <span className='confirmEmailInputlabel'>Enter OTP sent on you registered phone number</span>
                        <input type='email' placeholder='XXXXXX' className='confirmEmailInput' onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} />
                    </div>
                    <button
                        onClick={onVerifyCode}
                        className="confirmEmailContinueButton"
                    >
                        {isVerifying ? 'Loading...' : 'Submit'}
                    </button>
                    <button
                        onClick={() => {
                            setShow(false);
                        }}
                        className="confirmEmailCancelButton"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default PhoneVerify