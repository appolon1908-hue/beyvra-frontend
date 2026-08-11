import React from 'react'
import { Form, Button, Checkbox } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";
import { GlobalStates } from "@store/slices/global";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@store/hooks";
import { See, UnSee } from "assets/icons";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ISignInForm } from '@interfaces';
import { useCookies } from 'react-cookie';
import useLogin from 'api/user/useLogin';
import FormInput from '../components/FormInput';
import KYCButton from '../components/Button';
import { authCookieOptions } from 'security/authCookies';

interface SignInFormProps {
  setForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
  handleNext: (dir: string) => void
}


const NumberSignInForm: React.FC<SignInFormProps> = ({ handleNext }) => {
  const { signInTab } = useAppSelector(
    (state: { global: GlobalStates }) => state.global
  );

  const [, setCookie] = useCookies(["step", "access_token", "refresh_token",]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  })

  const { handleSubmit, register, formState: { errors } } = useForm<ISignInForm>();
  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      const cookieOptions = authCookieOptions();
      setCookie("access_token", data.access, cookieOptions);
      setCookie("refresh_token", data.refresh, cookieOptions);
      setCookie("step", '', cookieOptions)
      handleNext("next")
      // data?.user.is_walkthrough ? navigate('/platform') : navigate("/welcome");

    },
    onError: () => { },
  });

  const dispatch = useDispatch()
  const [reveal, setReveal] = useState(false)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  };
  const onSubmit: SubmitHandler<ISignInForm> = (data) => {
    mutate(formData);
  };

  return (

    <div className='w-full formContainer px-5 max-w-[520px] mx-auto'>
      <h5 className="text-white text-2xl font-semibold my-4">Sign in to your account</h5>
      <p className="text-white text-base font-medium my-6">Welcome back! Sign in to your account and enjoy your trading!</p>
      <p></p>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <Form.Item
            name="phone_number"
            validateStatus={errors.phone_number ? "error" : ""}
            help={errors.phone_number?.message}
            rules={[{ required: true, message: "Phone Number is required" }]}
          >

            <FormInput
              label="Phone number"
              type="text"
              id="phone_number"
              inputName="phone_number"
              placeholder="Phone number"
              onChange={handleInputChange}
            />
          </Form.Item>
        </div>
        <div className="">
          <Form.Item
            name="password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
            rules={[{ required: true, message: "password is required" }]}
          >
            <FormInput
              label="Password"
              type={reveal ? "text" : "password"}
              id="password"
              placeholder="Password"
              inputName="password"
              icon={<>
                <span onClick={() => setReveal(prev => !prev)}>
                  {reveal ? <See /> : <UnSee />}
                </span>
              </>}
              onChange={handleInputChange}
            />

          </Form.Item>
          <a className="flex text-base text-[#2dd674] gap-4 items-center mt-[-10px] "> Forgot password?</a>
        </div>

        <Form.Item name="fieldA" valuePropName="checked" className="agree-terms mt-8">
          <Checkbox className="custom-checkbox "> Remember Me</Checkbox>
        </Form.Item>
        <KYCButton
          text="Sign In"
          isLoading={isPending}
          disable={isPending}
          type="submit"
          className="kyc-button text-base font-semibold"
        />
      </Form>

      <p className="text-base my-6 text-[#C1C1C3]">Dont have an account? <NavLink to={'/signIn'} className={"text-[#2dd674]"}> Sign Up</NavLink></p>

    </div>

  );
};

export default NumberSignInForm;
