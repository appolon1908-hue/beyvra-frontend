/* eslint-disable react/button-has-type */
import React from 'react';
import './button.scss';
import { Spin } from 'antd';


const KYCButton = (props: any): JSX.Element => {
    const { text, action, className, icon, isLoading, disabled, animateClass, ...rest } = props;

    const btnLoadingComponent = () => (
        <div className="flex justify-center w-full items-center">
            <Spin />
        </div>
    );
    return (
        
        <button
            // @ts-ignore
            type="button"
            onClick={action}
            className={`cursor-pointer ${className} ${disabled ? 'button-disabled' : ''} ${isLoading ? 'not-allowed' : ''}`}
            disabled={disabled}
            {...rest}
        >
            {isLoading ? <div>{btnLoadingComponent()}</div> : <div className="text-center w-full">{text}</div>}
        </button>
            
    );
};
export default KYCButton;
