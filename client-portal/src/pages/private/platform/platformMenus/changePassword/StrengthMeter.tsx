import React, { useEffect, useState } from "react";
import "./strengthMeter.scss";
import { useAppSelector } from "@store/hooks";

interface StrengthMeterProps {
  password: string;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState<number>(1);

  useEffect(() => {
    const calculateStrength = () => {
      const lowercase = /[a-z]/.test(password);
      const uppercase = /[A-Z]/.test(password);
      const number = /[0-9]/.test(password);
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const conditionsMet = [lowercase, uppercase, number, specialChar].filter(
        Boolean
      ).length;

      setStrength(conditionsMet);
    };

    calculateStrength();
  }, [password]);

  const {themeSelect} = useAppSelector(state=> state.themeBg)

  return (
    <div className={`${themeSelect} strength-meter`}>
      <div className="strength-label">
        <p className="label">Password strength</p>{" "}
        <p className={`strength strength-${strength}`}>
          {strength === 1
            ? "Weak"
            : strength === 2
            ? "Medium"
            : strength === 3
            ? "Good"
            : strength === 4
            ? "Strong"
            : "Weak"}
        </p>
      </div>
      <progress
        className={`pwd-checker-bar strength-${strength}`}
        value={strength}
        max="4"
      />
    </div>
  );
};

export default StrengthMeter;
