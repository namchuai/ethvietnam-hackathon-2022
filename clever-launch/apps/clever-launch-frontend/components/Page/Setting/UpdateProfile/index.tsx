import { Avatar, Grid } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import Section from '../../../Common/AppSection';
import AppInput from '../../../Common/AppInput';
import TextareaApp from '../../../Common/AppTextArea';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import color from '../../../Base/theme/base/colors';
import AppButton from '../../../Common/AppButton';
import { useRouter } from 'next/router';
import { userService } from '../../../../services';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatValue } from '../../../../utils/formatValue';
import { ToastContainer, toast } from 'react-toastify';
import AvatarUploader from 'apps/clever-launch-frontend/components/Common/AppUploaderAvatar';
import AppDropDown from 'apps/clever-launch-frontend/components/Common/AppDropDown';

const schema = yup
  .object({
    email: yup.string().email(),
    //name: yup.string().required('Name is required'),
  })
  .required();

const initState = {
  email: '',
  name: '',
  city: '',
  country: '',
  avatarUrl: '',
  biography: '',
  urlProfilePage: '',
  website: '',
};

function UpdateProfile({ listCountries }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
    defaultValues: initState,
  });
  const { account } = useWeb3React<Web3Provider>();
  const [fileAvatar, setFileAvatar] = useState([]);

  const onSubmit = async (data) => {
    try {
      await userService.updateProfileUser(formatValue(data));
      toast.info('Update Profile Success !', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (account) {
      getProfile().then();
    }
  }, [account]);

  useEffect(() => {
    setValue('avatarUrl', fileAvatar[0]?.url ? fileAvatar[0]?.url : '');
  }, [fileAvatar]);

  async function getProfile() {
    try {
      const rawProfile = await userService.getProfileUserByWalletAddress(
        account
      );

      setValue('city', rawProfile.data.city);
      setValue('email', rawProfile.data.email);
      setValue('name', rawProfile.data.name);
      setValue('country', rawProfile.data.country);
      setValue('biography', rawProfile.data.biography);
      setValue('urlProfilePage', rawProfile.data.urlProfilePage);
      setValue('website', rawProfile.data.website);
      setValue('avatarUrl', rawProfile.data.avatarUrl);
      setFileAvatar(
        rawProfile.data.avatarUrl ? [{ url: rawProfile.data.avatarUrl }] : []
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Section>
        <ToastContainer />
        <Grid.Container gap={2}>
          <Grid xs={12} md={5}>
            <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
              <div className={'flex flex-col w-full'}>
                <AppInput
                  label="Name"
                  placeholder="Enter first name"
                  defaultValue={''}
                  register={register('name')}
                  name={'name'}
                  helperText={`${
                    errors?.name?.message ? errors?.name?.message : ''
                  }`}
                  color={`${errors?.name?.message ? 'error' : 'default'}`}
                  fullWidth
                  animated={false}
                />
                <div className={'mt-[25px]'} />
                <AppInput
                  label="Email"
                  placeholder="Enter email"
                  register={register('email')}
                  name={'email'}
                  defaultValue={''}
                  fullWidth
                  animated={false}
                  helperText={`${
                    errors?.email?.message ? errors?.email?.message : ''
                  }`}
                  color={`${errors?.email?.message ? 'error' : 'default'}`}
                />
                <div className={'mt-[25px]'} />
                <h4 className={'font-normal text-[14px] mb-2'}>Avatar</h4>

                <AvatarUploader files={fileAvatar} setFiles={setFileAvatar} />

                <div className={'mt-[25px]'} />

                <AppInput
                  label="City"
                  placeholder="Enter City"
                  defaultValue={''}
                  fullWidth
                  animated={false}
                  register={register('city')}
                  name={'city'}
                />
                <div className={'mt-[25px]'} />
                <p
                  className={`mb-[6px]  text-[14px]  font-normal text-[#212121]`}
                >
                  Country of Residence
                </p>
                <Controller
                  control={control}
                  name="country"
                  render={({ field: { onChange, value } }) => (
                    <AppDropDown
                      selectList={listCountries}
                      width="100%"
                      value={value}
                      placeholder="Select country"
                      height="44px"
                      handleSelect={(value) => {
                        onChange(value);
                      }}
                    />
                  )}
                />

                <div className={'mt-[25px]'} />
                <TextareaApp
                  label="Write your biography"
                  fullWidth
                  initialValue=""
                  defaultValue={''}
                  helperText={`${
                    errors?.biography?.message ? errors?.biography?.message : ''
                  }`}
                  color={`${errors?.biography?.message ? 'error' : 'default'}`}
                  register={register('biography')}
                  name={'biography'}
                  placeholder="Enter your amazing ideas."
                  cacheMeasurements
                  maxRows={20}
                  minRows={8}
                  value={watch('biography')}
                  onChange={(value) => console.log(value)}
                />
                <div className={'mt-[25px]'} />
                <div className={'mt-[25px]'} />
                <AppInput
                  label="Website"
                  placeholder="Enter Website"
                  defaultValue={''}
                  register={register('website')}
                  name={'website'}
                  fullWidth
                  animated={false}
                />
                <div className={'mt-[25px]'} />
                <div className={'flex'}>
                  <AppButton
                    auto
                    onClick={handleSubmit(onSubmit)}
                    bgCustom={`${color.orange['300']}`}
                  >
                    Save Settings
                  </AppButton>

                  <AppButton
                    style={{ marginLeft: '10px' }}
                    css={{ border: '1px solid #80808029' }}
                    onClick={() => router.push('/profile')}
                    auto
                    iconRight={<img src={'/assets/icon/arrow-right.svg'} />}
                    bgCustom={`#F9FAFB`}
                  >
                    Go to profile page
                  </AppButton>
                </div>
              </div>
            </form>
          </Grid>
        </Grid.Container>
      </Section>
    </div>
  );
}

export default UpdateProfile;
