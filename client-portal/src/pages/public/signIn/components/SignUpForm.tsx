import { Form, Button } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";

import useRegister from "api/user/useRegister";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import CountryCode from "../../../../helpers/CountryCode.json";
import Select, { type StylesConfig } from "react-select";
//import WalkThrough from "./WalkThrough";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignInTab } from "@store/slices/global";


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
  confirm_password: string;
  accepted_terms: boolean;
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
  type CountryOption = (typeof countriesList)[number];
  const [countryCode, setCountryCode] = useState<CountryOption>(countriesList[0]);
  const [show, setShow] = useState(false);
  const { handleSubmit, register, reset, watch, formState: { errors } } = useForm<SignUpFormData>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const password = watch("password", "");
  const strength = evaluatePasswordStrength(password);
  //const [showWalkThrough, setShowWalkThrough] = useState(false);



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
    onSuccess: () => {
      reset();
      toast.success("Registration successful. Sign in to continue.");
      dispatch(setSignInTab("1"));
      navigate("/signIn");
    },
  });

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    const localPhone = data.phone_number.replace(/\D/g, "");
    const payload = {
      email: data.email.trim().toLowerCase(),
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      password: data.password,
      phone_number: `${countryCode.value}${localPhone}`,
    };
    mutate(payload);
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    if (selectedOption) setCountryCode(selectedOption);
  };

  const customStyles: StylesConfig<CountryOption, false> = {
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
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          validateStatus={errors.first_name ? "error" : undefined}
          help={errors.first_name?.message}
        >
          <input
            className="loginInput"
            type="text"
            id="first_name"
            placeholder="First Name"
            autoComplete="given-name"
            {...register("first_name", {
              required: "First name is required",
              pattern: { value: /^[a-zA-Z ]+$/, message: "Use letters and spaces only" },
            })}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.last_name ? "error" : undefined}
          help={errors.last_name?.message}
        >
          <input
            className="loginInput"
            type="text"
            id="last_name"
            placeholder="Last Name"
            autoComplete="family-name"
            {...register("last_name", {
              required: "Last name is required",
              pattern: { value: /^[a-zA-Z ]+$/, message: "Use letters and spaces only" },
            })}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.email ? "error" : undefined}
          help={errors.email?.message}
        >
          <input
            className="loginInput"
            type="email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: "Email is required" })}
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
            validateStatus={errors.phone_number ? "error" : undefined}
            help={errors.phone_number?.message}
            style={{ width: "100%" }}
          >
            <input
              className="loginInput"
              style={{ width: "100%" }}
              type="tel"
              id="phone_number"
              placeholder="Phone number"
              autoComplete="tel-national"
              inputMode="numeric"
              {...register("phone_number", {
                required: "Phone number is required",
                pattern: { value: /^\d{6,14}$/, message: "Enter 6 to 14 digits without the country code" },
              })}
            />
          </Form.Item>
        </div>
        <Form.Item
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
        >
          <input
            className="loginInput"
            type={show ? "text" : "password"}
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
              maxLength: { value: 20, message: "Use no more than 20 characters" },
            })}
          />
        </Form.Item>
        <div className="password-meta">
          <span style={{ color: "white", fontSize: 12 }}>
            {"Password strength: " + strength}
          </span>
          <span
            onClick={() => setShow(!show)}
            style={{ color: "white", fontSize: 12, cursor: "pointer" }}
          >
            {show ? "Hide password" : "Show password"}
          </span>
        </div>

        <Form.Item validateStatus={errors.confirm_password ? "error" : undefined} help={errors.confirm_password?.message}>
          <input
            className="loginInput"
            type={show ? "text" : "password"}
            id="confirm_password"
            placeholder="Confirm password"
            autoComplete="new-password"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
        </Form.Item>

        <Form.Item validateStatus={errors.accepted_terms ? "error" : undefined} help={errors.accepted_terms?.message}>
          <label className="agreement-checkbox">
            <input type="checkbox" {...register("accepted_terms", { required: "You must accept the service agreement" })} />
            <span className="agreementSpan">
              I confirm that I am of legal age, I have read and agree to the<a href="/prv" target="_blank">&nbsp;Service agreement</a>.
            </span>
          </label>
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
