import React, { useState } from 'react'
import { useCookies } from "react-cookie";
import {  useForm, Controller } from 'react-hook-form';
import { Editable } from 'assets/icons';
import Input from "components/input/Input";
import PrimaryButton from 'components/primaryButton/PrimaryButton';
import { useAppDispatch } from '@store/hooks';
import { toast } from 'react-toastify';
import useChangePassowrd from 'api/user/useChangePassword';
import StrengthMeter from '../../changePassword/StrengthMeter';


const Password = () => {

    const [cookies] = useCookies(["access_token"]);
    const dispatch = useAppDispatch();

    // Password
    const {  mutate: passwordMutation, isPending: passwordLoading  } = useChangePassowrd({
        onSuccess: (data) => {
            toast.success('Password changed successfully');
        },
        onError: (error) => { },
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

    const { errors: passwordErrors } = passwordState;
    return (
        <div className='settingProfile h-full bg-[#1F324D66] p-8 rounded-lg overflow-y-auto'>
            <h3 className='text-xl font-normal text-white '>Change Password</h3>

            <div className="">
                <div className="form-container mb-10">
                <div>
                        {/* <ChangePassword /> */}
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
                                            <div className="absolute right-4 bottom-6"> <Editable/></div>
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
                                            <div className="absolute right-4 bottom-6"> <Editable/></div>
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
                                                <div className="absolute right-4 bottom-6"> <Editable/></div>
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
                                            className={`${passwordLoading? '': 'bg-[#28bd66]'} `}
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
                </div>
        </div>
        </div>
    )
}

export default Password