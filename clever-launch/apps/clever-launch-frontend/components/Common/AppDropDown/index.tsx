import React from 'react';

interface AppDropDownProp {
  selectList: Array<any>;
  width?: any;
  placeholder?: string;
  handleSelect?: any;
  value?: any;
  disabled?: boolean;
  height?: string;
  onClick?: any;
  editor?: any;
  errors?: any;
}

const AppDropDown = React.forwardRef<HTMLSelectElement, AppDropDownProp>(
  (
    {
      selectList,
      width,
      placeholder,
      handleSelect,
      value,
      disabled,
      height,
      errors,
      ...props
    },
    ref
  ) => (
    <div
      className={`flex justify-center`}
      style={{ width: width, height: height }}
    >
      <div className={`mb-3 w-full h-full relative`}>
        <select
          className={`form-select
          appearance-none
          block
          w-full
          h-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded-[8px]
          transition
          ease-in-out
          m-0
          ${errors ? ` hover:border-[#F31260] ` : ''}
          focus:text-gray-700 focus:bg-white
          focus:outline-none`}
          aria-label="Disabled select example"
          placeholder={placeholder}
          value={value || null}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
          }}
          ref={ref}
          {...props}
        >
          <option value="" disabled selected>
            {placeholder}
          </option>
          {selectList?.map((item: any, index: number) => {
            return (
              <option value={item.value} key={index}>
                {item.title || item.name}
              </option>
            );
          })}
        </select>

        <img
          src="/assets/create-project/down.svg"
          alt="down-icon"
          className="absolute top-[16px] right-[13px]"
        />
      </div>
    </div>
  )
);
export default AppDropDown;
