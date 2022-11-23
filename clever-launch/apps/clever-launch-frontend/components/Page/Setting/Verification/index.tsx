import Section from 'apps/clever-launch-frontend/components/Common/AppSection';
import { Grid } from '@nextui-org/react';
import AppInput from 'apps/clever-launch-frontend/components/Common/AppInput';
import AppDropDown from 'apps/clever-launch-frontend/components/Common/AppDropDown';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ImageUploader from '../../../Common/AppSingleUploader';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { userService } from '../../../../services';
import color from '../../../Base/theme/base/colors';
import AppButton from '../../../Common/AppButton';
import { TYPE_UPDATE_IMAGE } from '../../../../constants/upload';
import { EkycStatus } from '../../../../constants/status-ekyc';
import StatusEkyc from '../StatusEkyc';

export interface IVerificationState {
  address: string;
  countryOfResidence: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
}

interface IVerificationProps {
  listCountries?: any;
}

const initialState = {
  firstName: '',
  lastName: '',
  frontUrl: '',
  backUrl: '',
  selfie: '',
  dateOfBirth: '',
  countryOfResidence: 'VN',
};

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  frontUrl: yup.string().required('Image of front ID is required'),
  backUrl: yup.string().required('Image of back ID is required'),
  selfie: yup.string().required('Image selfie ID is required'),
});

function Verification({ listCountries }: IVerificationProps): JSX.Element {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
    defaultValues: initialState,
  });

  const [fileFront, setFileFront] = useState([]);
  const [fileBack, setFileBack] = useState([]);
  const [fileSelfi, setFileSelfi] = useState([]);
  const [informationCheckEkyc, setInformationCheckEkyc] = useState<any>(null);

  const { account } = useWeb3React<Web3Provider>();

  const onSubmit = async (data) => {
    try {
      await userService.updateEkycUser({
        ...data,
        frontUrl: fileFront[0]?.url,
        backUrl: fileBack[0].url,
        selfie: fileSelfi[0].url,
        dateOfBirth: moment(data.dateOfBirth).format('YYYY-MM-DD'),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitFailed = async (errors) => {
    console.log(errors);
  };

  useEffect(() => {
    if (account) {
      checkEkycProfile().then();
    }
  }, [account]);

  useEffect(() => {
    if (fileFront?.length > 0) {
      setValue('frontUrl', 'ok');
      clearErrors('frontUrl');
    } else {
      setValue('frontUrl', '');
    }
  }, [fileFront]);

  useEffect(() => {
    if (fileBack?.length > 0) {
      setValue('backUrl', 'ok');
      clearErrors('backUrl');
    } else {
      setValue('backUrl', '');
    }
  }, [fileBack]);

  useEffect(() => {
    if (fileSelfi?.length > 0) {
      setValue('selfie', 'ok');
      clearErrors('selfie');
    } else {
      setValue('selfie', '');
    }
  }, [fileSelfi]);

  async function checkEkycProfile() {
    try {
      const rawProfile = await userService.checkEkycProfile(account);
      setInformationCheckEkyc(rawProfile.data);
    } catch (e) {
      console.log(e);
    }
  }
  console.log(isDirty, isValid);

  return (
    <>
      {informationCheckEkyc?.eKycStatus === EkycStatus.NotStarted && (
        <form>
          <Section>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} md={6}>
                <div>
                  <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                    Personal information
                  </p>
                  <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                    Please make sure that{' '}
                    <span className="text-[16px] text-[#E94F37]">
                      all the information entered is consistent with your ID
                      documents.
                    </span>{' '}
                    You won’t be able to change it once confirmed.
                  </p>
                </div>
              </Grid>
              <Grid xs={12} md={6}>
                <div className={'w-full'}>
                  <div>
                    <p className="mb-[6px]  text-[14px]  font-normal text-[#212121]">
                      Country of Residence *
                    </p>

                    <Controller
                      control={control}
                      name="countryOfResidence"
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
                  </div>
                  <div className="flex justify-between gap-[30px] my-[16px]">
                    <AppInput
                      label="First name *"
                      placeholder="Enter first name"
                      defaultValue={''}
                      fullWidth
                      animated={false}
                      name={'firstName'}
                      register={register('firstName')}
                      helperText={`${
                        errors?.firstName?.message
                          ? errors?.firstName?.message
                          : ''
                      }`}
                      color={`${
                        errors?.firstName?.message ? 'error' : 'default'
                      }`}
                    />
                    <AppInput
                      label="Last name *"
                      placeholder="Enter Last name"
                      defaultValue={''}
                      fullWidth
                      animated={false}
                      name={'lastName'}
                      register={register('lastName')}
                      helperText={`${
                        errors?.lastName?.message
                          ? errors?.lastName?.message
                          : ''
                      }`}
                      color={`${
                        errors?.lastName?.message ? 'error' : 'default'
                      }`}
                    />
                  </div>

                  <div>
                    <AppInput
                      label=" Date of Birth *"
                      placeholder="Enter Last name"
                      fullWidth
                      animated={false}
                      type="date"
                      register={register('dateOfBirth', {
                        required: true,
                      })}
                      helperText={`${
                        errors?.dateOfBirth?.message
                          ? errors?.dateOfBirth?.message
                          : ''
                      }`}
                      color={`${
                        errors?.dateOfBirth?.message ? 'error' : 'default'
                      }`}
                    />
                  </div>
                </div>
              </Grid>
            </Grid.Container>
          </Section>

          <div className="border-b" />
          <Section>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} md={6}>
                <div>
                  <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                    ID Documents
                  </p>
                  <p className="full-w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                    Please capture and upload your ID or Passport and make sure
                    that all the details are clearly visible.
                  </p>
                </div>
              </Grid>
              <Grid xs={12} md={6}>
                <div className={'w-full flex justify-between gap-[30px]'}>
                  <ImageUploader
                    type={TYPE_UPDATE_IMAGE.EKYC_FRONT}
                    files={fileFront}
                    isPrivate={true}
                    setFiles={setFileFront}
                    errors={errors?.frontUrl?.message}
                  />
                  <ImageUploader
                    type={TYPE_UPDATE_IMAGE.EKYC_BACK}
                    files={fileBack}
                    isPrivate={true}
                    setFiles={setFileBack}
                    errors={errors?.backUrl?.message}
                  />
                </div>
              </Grid>
            </Grid.Container>
          </Section>

          <div className="border-b"></div>

          <Section>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} md={6}>
                <div>
                  <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                    Take the Selfie with your ID Documents
                  </p>
                  <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                    Please upload a picture of you holding your ID or Passport
                    and make sure that your whole face & ID documents are
                    visible, and center.
                  </p>
                </div>
              </Grid>
              <Grid xs={12} md={6}>
                <div className={'w-full'}>
                  <ImageUploader
                    type={TYPE_UPDATE_IMAGE.EKYC_SELFIE}
                    files={fileSelfi}
                    isPrivate={true}
                    setFiles={setFileSelfi}
                    errors={errors?.selfie?.message}
                  />
                </div>
              </Grid>
            </Grid.Container>
          </Section>
          <div className="border-b" />
          <Section>
            <Grid.Container gap={2} justify="center">
              <AppButton
                auto
                onClick={handleSubmit(onSubmit, onSubmitFailed)}
                bgCustom={`${color.orange['300']}`}
              >
                Save EKYC
              </AppButton>
            </Grid.Container>
          </Section>
        </form>
      )}
      {informationCheckEkyc?.eKycStatus !== EkycStatus.NotStarted && (
        <StatusEkyc status={informationCheckEkyc?.eKycStatus} />
      )}
    </>
  );
}

export default Verification;

//
