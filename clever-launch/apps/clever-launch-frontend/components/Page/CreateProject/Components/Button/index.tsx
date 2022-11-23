import { Grid } from '@nextui-org/react';
import Section from 'apps/clever-launch-frontend/components/Common/AppSection';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';

interface ButtonSubmitProps {
  tab?: any;
  onClick?: any;
  disabled?: boolean;
}

const ButtonSubmit = ({
  tab,
  onClick,
  disabled,
}: ButtonSubmitProps): JSX.Element => {
  return (
    <Section yPadding={'py-0'}>
      <Grid.Container>
        <Grid xs={12} md={12}>
          <div
            className={`flex ${
              tab == TABS.VERIFICATION ? `justify-start` : `justify-end`
            }
       w-full`}
          >
            <button
              className="rounded-[8px] bg-[#E8AA42] py-[8px] px-[14px]"
              onClick={onClick}
              disabled={disabled}
            >
              {tab == TABS.VERIFICATION ? (
                <span>Submit</span>
              ) : (
                <span>Next</span>
              )}
            </button>
          </div>
        </Grid>
      </Grid.Container>
    </Section>
  );
};

export default ButtonSubmit;
