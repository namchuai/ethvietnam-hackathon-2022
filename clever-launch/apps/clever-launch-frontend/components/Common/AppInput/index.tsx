import { Input, InputProps } from '@nextui-org/react';
import React from 'react';

interface AppInputProps extends Omit<any, 'width'> {
  width?: string;
  css?: any;
  onChange?: any;
  value: any;
  defaultValue: any;
  register?: any;
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ width, css, value, register, defaultValue, ...props }, ref) => (
    <Input
      bordered
      width={width}
      css={{
        ...css,
        '& .nextui-c-eXOOPO': {
          borderRadius: '8px',
        },
      }}
      shadow={false}
      animated={false}
      value={value}
      defaultValue={defaultValue}
      ref={ref}
      {...register}
      {...props}
    />
  )
);

AppInput.displayName = 'AppInput';

export default AppInput;
