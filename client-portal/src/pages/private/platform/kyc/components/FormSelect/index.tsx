import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import ChevronDown from 'assets/icons/kyc/chevron_down.svg';
import './formSelect.scss';
import useOutsideClick from 'hooks/useOutsideClick';
import { cloneDeep } from 'lodash';
// import useOutsideClick from '../hooks/useOutsideClick';

interface DropdownItem {
  value: string;
  label: string;

}

interface DropdownProps {
  id: string;
  label?: string;
  placeholder?: string;
  value?: string
  data: DropdownItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  style?: string;
  name?: string;
  selectedId?: string;
  className?: string;
  onSelect?: (id: string) => void;
}

const FormSelect = ({
  id,
  label,
  placeholder = 'Select',
  data,
  position = 'bottom-left',
  className,
  name,
  style,
  selectedId,
  value,
  onSelect,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
    selectedId ? data?.find((item) => item.value === selectedId) : undefined
  );


  const handleChange = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect && onSelect(item.value);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedId && data) {
      const newSelectedItem = data.find((item) => item.value == selectedId);
      newSelectedItem && setSelectedItem(newSelectedItem);
    } else {
      setSelectedItem(undefined);
    }
  }, [selectedId, data]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
  });

  const dropdownClass = classNames(
    'absolute  w-full max-h-52 overflow-y-auto bg-[#162840] py-3 rounded-lg shadow-md z-10',
    {
      'top-full right-0 mt-2': position === 'bottom-right',
      'top-full left-0 mt-2': position === 'bottom-left',
      'bottom-full right-0 mb-2': position === 'top-right',
      'bottom-full left-0 mb-2': position === 'top-left',
    }
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}` }>
        <label className="text-base text-white font-medium">{label}</label>
      <div
        id={id}
        aria-label='Select'
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'select-selector flex justify-between items-center gap-5 rounded w-full  mt-1 text-white',
          style
        )}
      >
        <span className='text-sm'>{selectedItem?.label || placeholder}</span>
        <img 
            src={ChevronDown} 
            className={classNames('transform duration-500 ease-in-out', {
            'rotate-180': isOpen,
            })}
        />
      </div>
      {/* Open */}
      {isOpen && (
        <div aria-label='Dropdown menu ' className={`${dropdownClass} dropdown-menu`}>
          <ul
            role='menu'
            aria-labelledby={id}
            aria-orientation='vertical'
            className='leading-10'
          >
            {data?.map((item) => (
              <li
                key={item.value}
                onClick={() => handleChange(item)}
                className={classNames(
                  'flex items-center cursor-pointer hover:bg-gray-200 text-[#90ACC1]  hover:text-black px-3',
                  { 'bg-gray-300': selectedItem?.value === item.value }
                )}
              >
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
