import { useCookies } from "react-cookie";
import { useForm, Controller } from 'react-hook-form';
import './settingsProfile.scss'
import DropDownOptions from '../components/dropDownOptions/DropDown';
import { Editable } from 'assets/icons';
import Input from "components/input/Input";
import PrimaryButton from 'components/primaryButton/PrimaryButton';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { INotification } from '@interfaces';
import Toggle from 'components/toggle/Toggle';
import useNotificationToggle from 'api/notification/useToggleNotification';
import { setNotificationList } from '@store/slices/notification';
import { toast } from 'react-toastify';
import useChangePassowrd from 'api/user/useChangePassword';
import StrengthMeter from '../../changePassword/StrengthMeter';
import TwoFA from './2FA';
import AppearanceMenu from '../../appearance/AppearanceMenu';
import TradingMenu from '../../trading/TradingMenu';
import EmailVerify from './EmailVerify';
import PhoneVerify from './PhoneVerify';
import useNotificationList from 'api/notification/useNotificationList';
import EmailPreferencesPanel from '../../notifications/EmailPreferencesPanel';

const Settings = () => {
    const [cookies] = useCookies(["access_token"]);
    const { notificationList } = useAppSelector((state) => state.notification);
    const dispatch = useAppDispatch();

    const { mutate: notificationListMutate } = useNotificationList({
        onSuccess: (data) => {
            dispatch(setNotificationList(data.notifications));
        },
        onError: (error) => {
            console.error("fetching notification list error", error);
        },
    });

    const { mutate } = useNotificationToggle({
        onSuccess: () => {
            notificationListMutate(cookies.access_token);
        },
        onError: () => { },
    });

    // User
    const { mutate: passwordMutation, isPending: passwordLoading } = useChangePassowrd({
        onSuccess: () => {
            toast.success('Password changed successfully');
        },
        onError: () => { },
    });

    const onPasswordSubmit = (data: any) => {
        passwordMutation({ token: cookies.access_token, formData: data });
    };

    const {
        handleSubmit: handlePasswordSubmit,
        watch: passwordWatch,
        control: passwordControl,
        formState: passwordState } =
        useForm({
            defaultValues: {
                old_password: "",
                new_password: "",
                new_password_confirm: ""
            },
        });

    const newPass = passwordWatch("new_password");

    const handleNotificationToggle = (data: INotification) => {
        if (!data.id) return;

        mutate({
            data: { notification_id: data.id, is_enabled: !data.is_enabled },
        });
    };
    const { errors: passwordErrors } = passwordState;

    return (
        <div className='settingProfile bg-[#26272b] px-8 py-4 rounded-lg overflow-y-auto'>
            <h3 className='text-xl font-normal text-white '>Settings</h3>
            <DropDownOptions
                options='2 factor Authentication'>
                <TwoFA />
            </DropDownOptions>

            <DropDownOptions options='Password'>
                <div>
                    <div className="form-container mb-10">
                        <form
                            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                        >
                            <div className='flex flex-col  gap-2'>
                                <div>
                                    <div className="mt-4 ">
                                        <div className="relative">
                                            <Controller
                                                name="old_password"
                                                control={passwordControl}
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
                                            <div className="absolute right-4 bottom-6"> <Editable /></div>
                                        </div>
                                        <p className="error_msg font-normal">
                                            {passwordErrors.old_password?.type === "required" &&
                                                "Old password is required."}
                                        </p>
                                    </div>
                                    <div className="mt-4 ">
                                        <div className='relative'>
                                            <Controller
                                                name="new_password"
                                                control={passwordControl}
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
                                            <div className="absolute right-4 bottom-6"> <Editable /></div>
                                        </div>
                                        <p className="error_msg font-normal">
                                            {passwordErrors.new_password?.type === "required" &&
                                                "New password is required."}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mt-4">
                                            <div className="relative">
                                                <Controller
                                                    name="new_password_confirm"
                                                    control={passwordControl}
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
                                                <div className="absolute right-4 bottom-6"> <Editable /></div>
                                            </div>
                                            <p className="error_msg font-normal">
                                                {passwordErrors.new_password_confirm?.type === "required" &&
                                                    "Confirm password is required."}
                                            </p>
                                        </div>
                                    </div>
                                    <StrengthMeter password={newPass} />
                                    <div className="mt-5">
                                        <PrimaryButton
                                            className={`${passwordLoading ? '' : 'bg-[#0094FF]'} `}
                                            Title="Change password"
                                            htmlType="submit"
                                            loading={passwordLoading}
                                        />
                                    </div>
                                </div>



                            </div>



                        </form>
                    </div>
                </div>
            </DropDownOptions>
            <DropDownOptions
                options='Notification'
            >
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <p className="notificationsSectionTitle">
                        Select the notifications you want to receive
                    </p>
                    {notificationList.map((notificationData: INotification, _i: number) => (
                        <Toggle
                            key={_i}
                            label={notificationData?.name}
                            onChange={() => handleNotificationToggle(notificationData)}
                            subtext={notificationData?.description}
                            defaultChecked={notificationData?.is_enabled}
                            infoText={notificationData?.name === "Push Notifications" ? "Why should I receive them?" : ""}
                        />
                    ))}
                </div>
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <EmailPreferencesPanel />
                </div>
            </DropDownOptions>
            <DropDownOptions
                options='Trading'
            >
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <TradingMenu />
                </div>
            </DropDownOptions>
            <DropDownOptions
                options='Appearance'
            >
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <AppearanceMenu />
                </div>
            </DropDownOptions>
            <DropDownOptions
                options='Email Verification'
            >
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <EmailVerify />
                </div>
            </DropDownOptions>
            <DropDownOptions
                options='Phone Verification'
            >
                <div className="notificationsMenuSection" style={{ paddingLeft: 16, paddingRight: 16 }}>
                    <PhoneVerify />
                </div>
            </DropDownOptions>
        </div>
    )
}

export default Settings