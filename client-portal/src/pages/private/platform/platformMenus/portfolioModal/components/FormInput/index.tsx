import React, { forwardRef } from 'react';

import './formInput.scss';

const FormInput = forwardRef(
    (
        {
            label = '',
            labelClass = 'label-class',
            icon = '',
            inputName,
            inputType,
            inputClass = '',
            showErrorMessage = true,
            placeholderIcon = '',
            required = false,
            onChange,
            inputValue = '',
            ...rest
        }: any,
        ref
    ) => (
        <>
           

            <div className="relative ">
                <label htmlFor={inputName} className={`${labelClass} text-white font-semibold opacity-50  pl-3 top-[5px] absolute `}>{label}</label>
                <input
                    className={`block w-full pb-2 pt-7 pl-3 pr-14 form-input text-sm border-[0.1px] rounded-lg focus:ring-0 ${inputClass}`}
                    name={inputName}
                    type={inputType}
                    onChange={onChange}
                    value={inputValue}
                    {...rest}
                />
                {icon && (
                    <div className="absolute right-4 bottom-4">{icon}</div>
                )}
            </div>
        </>
    )
);

export default FormInput;
