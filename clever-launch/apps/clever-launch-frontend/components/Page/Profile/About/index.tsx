import { Grid } from '@nextui-org/react';
import React from 'react';
import Section from '../../../Common/AppSection';

interface IAbout {
  profile: any;
}

function About({ profile }: IAbout) {
  return (
    <Section>
      <Grid.Container>
        <Grid xs={12} md={6}>
          <div className={'border-b-[1px] pb-[20px] w-full'}>
            <h2 className={'text-[20px] font-semibold mb-[20px]'}>Biography</h2>
            <p className={'text-base font-normal text-[#4D4D4D]'}>
              {profile?.biography}
            </p>
          </div>
        </Grid>
      </Grid.Container>

      <Grid.Container>
        <Grid xs={12} md={6}>
          <div className={'pt-[30px] w-full'}>
            <h2 className={'text-[20px] font-semibold mb-[20px]'}>Contact</h2>
            <h4 className={'text-base font-normal text-[#1F4690]'}>
              {profile?.email}
            </h4>
          </div>
        </Grid>
      </Grid.Container>
    </Section>
  );
}

export default About;
