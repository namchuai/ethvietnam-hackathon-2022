import { ReactNode } from 'react';

type ISectionProps = {
  yPadding?: string;
  children: ReactNode;
};

const Section = (props: ISectionProps) => (
  <div
    className={`w-full p-4 md:px-[112px] ${
      props.yPadding ? props.yPadding : 'py-8'
    }`}
  >
    {props.children}
  </div>
);

export default Section;
