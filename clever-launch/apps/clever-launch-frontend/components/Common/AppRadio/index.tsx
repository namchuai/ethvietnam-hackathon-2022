import { Radio } from '@nextui-org/react';
import { RadioProps } from '@nextui-org/react/types/radio/radio';
import React from 'react';

interface AppRadioProps extends Omit<RadioProps, 'className'> {
  className?: string;
  listRadio: Array<any>;
  defaultValue?: string;
  onChange?: any;
  ref?: any;
}

function AppRadio({
  defaultValue,
  listRadio,
  className,
  onChange,
  ref,
  ...props
}: AppRadioProps) {
  return (
    <Radio.Group
      defaultValue={defaultValue}
      onChange={onChange}
      name="radio-group"
      {...props}
      ref={ref}
    >
      {listRadio.map((item, index) => {
        return (
          <div className={className} key={index}>
            <Radio value={item.value}>{item.title}</Radio>
          </div>
        );
      })}
    </Radio.Group>
  );
}

export default AppRadio;
