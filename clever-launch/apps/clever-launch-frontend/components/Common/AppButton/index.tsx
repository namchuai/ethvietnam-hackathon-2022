import { ButtonProps, Button } from '@nextui-org/react';
import { ReactNode } from 'react';

interface IAppButtonProps extends Omit<ButtonProps, 'fullWidth'> {
  fullWidth?: boolean;
  width?: string;
  css?: any;
  text?: string;
  ref?: any;
  textColor?: string;
  children: ReactNode;
  bgCustom?: any;
}

function AppButton({
  css,
  fullWidth,
  width,
  ref,
  text,
  children,
  bgCustom,
  textColor,
  ...props
}: IAppButtonProps) {
  return (
    <Button
      css={{
        backgroundColor: `${bgCustom}`,
        color: `${textColor}`,
        width: `${width}`,
        borderRadius: '8px',
        ...css,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

AppButton.defaultProps = {
  textColor: '#212121',
};

export default AppButton;
