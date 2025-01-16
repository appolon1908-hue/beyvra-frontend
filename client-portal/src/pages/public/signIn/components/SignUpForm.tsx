import { Checkbox, Form, Button } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";

import useRegister from "api/user/useRegister";
import { toast } from "react-toastify";
import { GlobalStates, setSignInTab } from "@store/slices/global";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@store/hooks";
import { useEffect, useState } from "react";
import CountryCode from "../../../../helpers/CountryCode.json";
import Select from "react-select";
//import WalkThrough from "./WalkThrough";
import WelcomeSteps from "../../../private/welcomeSteps/steps/WelcomeSteps";


import { useCookies } from "react-cookie";


import "./WalkThrough.scss";
const countriesList = CountryCode.map((item) => ({
  value: item.dial_code,
  label: item.code + " " + item.dial_code,
  code: item.code,
})).sort((a, b) => {
  if (a.label < b.label) return -1; // a comes before b
  if (a.label > b.label) return 1; // a comes after b
  return 0; // names are equal
});
interface SignUpFormData {
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  password: string;
}

const evaluatePasswordStrength = (password: string) => {
  let strength = "Weak";
  const lengthCriteria = password.length >= 8;
  const numberCriteria = /[0-9]/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const lowercaseCriteria = /[a-z]/.test(password);
  const specialCharacterCriteria = /[!@#$%^&*]/.test(password);

  const criteriaMet = [
    lengthCriteria,
    numberCriteria,
    uppercaseCriteria,
    lowercaseCriteria,
    specialCharacterCriteria,
  ].filter(Boolean).length;

  if (criteriaMet >= 4) {
    strength = "Strong";
  } else if (criteriaMet === 3) {
    strength = "Medium";
  }

  return strength;
};

const SignUpForm = () => {
  const [countryCode, setCountryCode] = useState();
  const [show, setShow] = useState(false);
  const { handleSubmit, register, reset, watch } = useForm<SignUpFormData>();
  const dispatch = useDispatch();
  const password = watch("password", "");
  const strength = evaluatePasswordStrength(password);
  //const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [showWelcomeSteps, setShowWelcomeSteps] = useState(false);
  const [registerData, setRegisterData] = useState(false);


  const [cookies, setCookie] = useCookies(['session_token']);



  useEffect(() => {
    if (countriesList.length > 0) {
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
          const cCode = data.country_code;
          const matchedLanguage = countriesList.find(
            (item) => item.code.toLowerCase() === cCode.toLowerCase()
          );
          if (matchedLanguage) {
            setCountryCode(matchedLanguage);
          } else {
            setCountryCode(countriesList[0]);
          }
        });
    }
  }, [countriesList]);

  const { mutate, isPending } = useRegister({
    onSuccess: (data) => {
      //console.log("SUCCES REGISTRATION");
      //console.log(registerData);
      //showWelcomeSteps(true);
      
      //Write my code here - ER

      
      setCookie("session_token", data.session_token, { maxAge: GlobalLoginMaxAge });
      

      // reset();
      // toast.success(
      //   "Success! An email has been sent to your account. Please verify your email to complete the registration process."
      // );
    },
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    window.location.href = "/welcomesteps";
    setRegisterData(data);
    const temp = { ...data };
    temp.phone_number = countryCode.value + temp.phone_number;
    mutate(temp);
  };

  const handleCountryChange = (selectedOption) => {
    setCountryCode(selectedOption);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 112,
      borderRadius: "0.53894rem",
      border: "0.0539rem solid #272930",
      background: "#14161a",
      outline: 0,
      color: "#fff",
      height: 40,
      marginRight: 8,
    }),
    option: (provided, state) => ({
      ...provided,
      border: "none",
      padding: "10px 20px",
      backgroundColor: state.isFocused ? "lightblue" : "white",
      color: "black",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
    }),
  };

  return (
    <>
      {showWelcomeSteps && <WelcomeSteps />}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          name="first_name"
          rules={[{ required: true, message: "First Name is required" }]}
        >
          <input
            className="loginInput"
            type="text"
            id="first_name"
            placeholder="First Name"
            {...register("first_name")}
          />
        </Form.Item>

        <Form.Item
          name="last_name"
          rules={[{ required: true, message: "Last Name is required" }]}
        >
          <input
            className="loginInput"
            type="text"
            id="last_name"
            placeholder="Last Name"
            {...register("last_name")}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <input
            className="loginInput"
            type="email"
            id="email"
            placeholder="Email"
            {...register("email")}
          />
        </Form.Item>
        <div style={{ display: "flex", width: "100%" }}>
          {
            <Select 
              options={countriesList}
              value={countryCode}
              onChange={handleCountryChange}
              className="loginInput no-padding"
              key={Math.random().toString()}
              styles={customStyles}
            />
          }
          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: "Phone number is required" }]}
            style={{ width: "100%" }}
          >
            <input
              className="loginInput"
              style={{ width: "100%" }}
              type="text"
              id="phone_number"
              placeholder="Phone number"
              {...register("phone_number")}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <input
            className="loginInput"
            type={show ? "text" : "password"}
            id="password"
            placeholder="Password"
            {...register("password")}
          />
        </Form.Item>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: -8,
            marginBottom: 16,
          }}
        >
          <span style={{ color: "white", fontSize: 12 }}>
            {"Password strength: " + strength}
          </span>
          <span
            onClick={() => setShow(!show)}
            style={{ color: "white", fontSize: 12, cursor: "pointer" }}
          >
            {show ? "Hide password" : "Show password"}
          </span>
        </div> */}


        <Form.Item>
          <Checkbox>
            <span className="agreementSpan">
              I confirm that I am of legal age, I have read and agree to the<a href="/prv" target="_blank">&nbsp;Service agreement</a>.
            </span>
          </Checkbox>
        </Form.Item>






        <Button
          type="primary"
          htmlType="submit"
          className="login"
          loading={isPending}
        >
          Register
        </Button>

        
      </Form>
    </>
  );
};

export default SignUpForm;
