import { Modal } from 'antd';
import './settingsProfile.scss'
import { useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSendEmailVerification from 'api/user/useSendEmailVerification';

const EmailVerify = () => {
    const [show, setShow] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const { user } = useAppSelector((state) => state.user);
    const [cookies] = useCookies(["access_token"]);

    const { mutate } = useSendEmailVerification({
        onSuccess: () => {
            setEmailSent(true);
            setEmail('');
            setShow(false);
        },
        onError: () => {
            setEmail('');
            setShow(false);
        },
    });

    const onSendVerification = () => {
        if (email) mutate({ token: cookies.access_token, email });
    };

    useEffect(() => {
        user?.email_verified && setEnabled(user?.email_verified);
    }, [user?.email_verified])

    return (
        <>
            {!enabled ? (
                <>
                    {emailSent ?
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <p>✔️ Verification Email sent.</p>
                        </div>
                        : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button
                                onClick={() => {
                                    setShow(true);
                                }}
                                className="verifyEmailButton"
                            >
                                Verify Email
                            </button>
                        </div>}
                </>
            )
                :
                (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <p>✔️ Email verified.</p>
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
                    <span className='confirmEmailTitle'>Confirm your Email</span>
                    <span className='confirmEmailSubTitle'>Enter your email address</span>

                    <div className='confirmEmailInputCotainer'>
                        <span className='confirmEmailInputlabel'>Email</span>
                        <input type='email' placeholder='sample@example.com' className='confirmEmailInput' onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <button
                        onClick={onSendVerification}
                        className="confirmEmailContinueButton"
                    >
                        Continue
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

export default EmailVerify