import React, { useRef, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useForm } from 'react-hook-form';
import { register } from 'module';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import useOTPVerification from 'api/user/useOTPVerication';
import KYCButton from '../components/Button';


interface OTPInputProps{
  otp1: number,
  otp2: number,
  otp3: number,
  otp4: number

}

interface OTPProps {
  handleNext: (dir: string) => void
}
const OTPVerification: React.FC<OTPProps> = ({ handleNext }) => {

  const navigate = useNavigate();
  const [, setCookie] = useCookies(["step","access_token", "refresh_token",]);
  const { handleSubmit, register, reset, formState: {errors} } = useForm<OTPInputProps>();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRef:any = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const { mutate, isPending } = useOTPVerification({
    onSuccess: (data) => {
      // const expirationInSeconds = 270;
      
      
      handleNext("next");

     
      
    },
    onError: () => {},
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  const handleInputChange = (i: number, e: any) => {
    if (e <= "9" && e >= "0") {
      setOtp((otp) => {
        const temp = [...otp];
        temp[i] = e;
        return temp;
      });
      if (i < otp.length - 1) {
        inputRef[i + 1].current.focus();
      }
    } else {
      if (e == "Backspace") {
        console.log(otp[i]);
        if (otp[i] == "") {
          if (i > 0) {
            inputRef[i - 1].current.focus();
          }
        } else {
          setOtp((otp) => {
            const temp = [...otp];
            temp[i] = "";
            return temp;
          });
        }
      }
    }
  }

  return (
    <div className='w-full formContainer px-5 max-w-[520px] mx-auto'>
      <h5 className="text-white text-2xl font-semibold my-4">OTP Verification</h5>
      <p className='text-white text-base font-medium my-6'>
        We have sent a verification code to your email (or phone number). You can resend the code after 1 minute.
      </p>
      <button type="button" className='text-[#2dd674] block my-10' disabled title="Resend becomes available after the verification timer expires">
        Resend unavailable
      </button>

      <Form layout="vertical" onFinish={onSubmit} >
        <div className='grid grid-cols-4 gap-6 my-10'>
          {otp.map((value, index) => (
            <input
              key={index}
              type="number"
              name={`${index}`}
              ref={inputRef[index]}
              placeholder='-'
              value={value}
              onKeyDown={(e) => handleInputChange(index, e.key)}
              className=" px-5 py-6 flex justify-center items-center text-center font-semibold text-4xl block w-full  form-input  text-3xl rounded-xl focus:ring-0"
            />
          ))}
          
        </div>
      <KYCButton
        text="Submit"
        isLoading={isPending}
        disable={isPending}
        type="submit"
        className="kyc-button text-base font-semibold"
      />
      </Form>
    </div>
  );
};

export default OTPVerification;
