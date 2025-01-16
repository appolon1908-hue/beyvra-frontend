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
            <label htmlFor={inputName} className={labelClass}>{label}</label>

            <div className="relative mt-1">
                <input
                    className={`block w-full py-4 pl-3 pr-14 form-input text-sm border rounded-lg focus:ring-0 ${inputClass}`}
                    name={inputName}
                    type={inputType}
                    onChange={onChange}
                    value={inputValue}
                    {...rest}
                />
                {icon && (
                    <div className="absolute right-2.5 bottom-4">{icon}</div>
                )}
            </div>
        </>
    )
);

export default FormInput;
