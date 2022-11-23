import { Textarea } from '@nextui-org/react';
import { TextareaProps } from '@nextui-org/react/types/textarea';
import React from 'react';

interface AppInputProps extends Omit<TextareaProps, 'width'> {
  width?: string;
  css?: any;
  onChange?: any;
  value?: any;
  defaultValue?: any;
  register?: any;
}

const TextareaApp = React.forwardRef<HTMLTextAreaElement, AppInputProps>(
  ({ width, css, onChange, value, register, defaultValue, ...props }, ref) => (
    <Textarea
      bordered
      width={width}
      css={{
        ...css,
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

TextareaApp.displayName = 'TextareaApp';
export default TextareaApp;
