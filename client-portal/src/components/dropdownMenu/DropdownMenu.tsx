import React, { useEffect, useRef, useState } from 'react';
import './DropdownMenu.scss';

const DropdownMenu = (props: any) => {
    const { position = "right", menuItems, children, type, customMenuItem = false } = props;
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener('click', handler);
        return () => {
            window.removeEventListener('click', handler);
        };
    });

    const handleDropDownClick = () => {
        // @ts-ignore
        // console.log(dropdownRef?.current?.getBoundingClientRect());
        props?.callback && props?.callback(!open)
        setOpen(!open)
    };

    const renderDropDown = () => {
        return (
            <div
                className="dropdown-anchor"
                ref={dropdownRef}
                onClick={handleDropDownClick}
            >
                {children}
                <div className={`dropdown-children  ${open ? 'show' : 'hidden'} ${position}`}>
                    {!customMenuItem ? (
                        <>
                            {menuItems.map((item: any, _i: number) => (
                                <div className="menu-container" onClick={item.onclick}>
                                    {item?.icon && <div className="icon-container">{item.icon}</div>}
                                    <div>{item?.text}</div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className=''>{menuItems}</div>
                    )}

                </div>
            </div>
        )
    };

    const renderMenu = () => {
        if (type === "drop-down") {
            return renderDropDown()
        } else {
            return (
                <div className="dropdown-anchor">
                    {children}
                </div>
            )
        }
    };
    return (
        <>
            {renderMenu()}
        </>
    );
};
export default DropdownMenu;
