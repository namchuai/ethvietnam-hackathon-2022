import Section from 'apps/clever-launch-frontend/components/Common/AppSection';
import { Grid } from '@nextui-org/react';
import AppInput from 'apps/clever-launch-frontend/components/Common/AppInput';
import AppDropDown from 'apps/clever-launch-frontend/components/Common/AppDropDown';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import ImageUploader from '../../../Common/AppSingleUploader';
import { TYPE_UPDATE_IMAGE } from '../../../../constants/upload';
import ButtonSubmit from '../Components/Button';
import ErrorMessage from '../Components/ErrorMessage';
import {
  createProject,
  getPendingProject,
  kycUserInfo,
  updateProjectPending,
} from 'apps/clever-launch-frontend/services/create-project';
import { formatValue } from 'apps/clever-launch-frontend/utils/formatValue';
import { useWeb3React } from '@web3-react/core';
import { checkEkycProfile } from 'apps/clever-launch-frontend/services/user';
import { useRouter } from 'next/router';

interface IVerificationProps {
  eKycStatus?: string;
  activeTab?: any;
  projectId?: any;
  setIsProcessing?: any;
  setIsUpLoad?: any;
  listCountries?: any;
}

const schemaNotStart = yup.object().shape({
  walletAddress: yup.string().required('Blockchain wallet address is required'),
  contactEmail: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  countryOfResidence: yup.string().required('Country is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  frontUrl: yup.string().required('Image of front ID is required'),
  backUrl: yup.string().required('Image of back ID is required'),
  selfie: yup.string().required('Image selfie ID is required'),
});

const schemaDiffStart = yup.object().shape({
  walletAddress: yup.string().required('Blockchain wallet address is required'),
  contactEmail: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
});

function Verification({
  eKycStatus,
  projectId,
  setIsProcessing,
  setIsUpLoad,
  listCountries,
}: IVerificationProps): JSX.Element {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      eKycStatus !== 'NotStarted' ? schemaDiffStart : schemaNotStart
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
  });
  const route = useRouter();
  const [fileFront, setFileFront] = useState([]);
  const [fileBack, setFileBack] = useState([]);
  const [fileSelfi, setFileSelfi] = useState([]);
  const { account } = useWeb3React();

  const { tab } = route.query as { tab?: string };

  useEffect(() => {
    setValue('frontUrl', fileFront[0]?.url ? fileFront[0]?.url : '');
    setValue('backUrl', fileBack[0]?.url ? fileBack[0]?.url : '');
    setValue('selfie', fileSelfi[0]?.url ? fileSelfi[0]?.url : '');
  }, [fileFront, fileBack, fileSelfi]);

  const onSubmit = async (data) => {
    const dataState = {
      walletAddress: data.walletAddress,
      contactEmail: data.contactEmail,
    };
    const dataKyc = {
      ...data,
      walletAddress: undefined,
      contactEmail: undefined,
    };

    if (dataKyc?.firstName) {
      try {
        const { status } = await kycUserInfo(formatValue(dataKyc));
        eKycStatus === 'Successful' && setIsProcessing(false);
        if (status == 200 || status == 201) {
          handleUpdateProject(dataState);
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      handleUpdateProject(dataState);
    }
  };

  const handleUpdateProject = async (dataState) => {
    try {
      const { data, status } = await updateProjectPending(
        formatValue(dataState)
      );
      if (status == 200 || status == 201) {
        handleGetProjectPending();
        handlePost(formatValue(data));
        setIsProcessing(true);
        setIsUpLoad(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePost = async (data) => {
    const dataPost = {
      contactEmail: data?.contactEmail,
      durationInDay: data?.durationInDay ? data?.durationInDay : '',
      fundRaisingMethod: data?.fundRaisingMethod,
      fundingGoal: data?.fundingGoal ? data?.fundingGoal : '',
      introType: data?.introType,
      introUrl: data?.introUrl,
      projectId,
      story: data?.story,
      subTitle: data?.subTitle,
      tags: data?.tags,
      title: data?.title,
      walletAddress: data?.walletAddress,
      creatorId: account,
      pitchDeckUrl: data?.pitchDeckUrl ? data?.pitchDeckUrl : '',
    };

    try {
      const { status } = await createProject(formatValue(dataPost));
      if ((status == 200 || status == 201) && eKycStatus !== 'NotStarted') {
        console.log('done');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProjectPending = async () => {
    try {
      const { data, status } = await getPendingProject({});
      if (status == 200 && Object.keys(data).length != 0) {
        setValue('walletAddress', data?.walletAddress);
        setValue('contactEmail', data?.contactEmail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckEkycProfile = async () => {
    try {
      const { data, status } = await checkEkycProfile(account);
      if (status == 200 && data) {
        setValue('eKycStatus', data?.eKycStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCheckEkycProfile();
    handleGetProjectPending();
  }, []);

  const renderKYC = (eKycStatus) => {
    switch (eKycStatus) {
      case 'InReview':
        return (
          <Section>
            <div>
              <img src="/assets/create-project/wanning.svg" alt="" />
              <p className="text-[#4D4D4D] text-[20px] font-semibold mt-[20px] mb-[8px]">
                Processing
              </p>
              <p className="font-normal text-[16px] text-[#4D4D4D] ">
                We are in the process of approving your information,You will get
                the results soon.
              </p>
            </div>
          </Section>
        );

      case 'Successful':
        return (
          <Section>
            <div>
              <img src="/assets/create-project/success_1.svg" alt="" />
              <p className="text-[#4D4D4D] text-[20px] font-semibold mt-[20px] mb-[8px]">
                Verify success
              </p>
              <p className="font-normal text-[16px] text-[#4D4D4D] ">
                Your account has been verified successfully
              </p>
            </div>
          </Section>
        );

      case 'ReviewFailed':
        return (
          <Section>
            <div>
              <img src="/assets/create-project/cry.svg" alt="" />
              <p className="text-[#4D4D4D] text-[20px] font-semibold mt-[20px] mb-[8px]">
                Review failed
              </p>
              <p className="font-normal text-[16px] text-[#4D4D4D] ">
                Your account has been verified unsuccessfully
              </p>
            </div>
          </Section>
        );

      default:
        return (
          <>
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
                      <p
                        className={`mb-[6px]  text-[14px]  font-normal ${
                          errors?.countryOfResidence?.message
                            ? `text-[#F31260]`
                            : `text-[#212121]`
                        }  `}
                      >
                        Country of Residence
                      </p>

                      <div>
                        <Controller
                          control={control}
                          name="countryOfResidence"
                          render={({ field }) => (
                            <AppDropDown
                              selectList={listCountries}
                              width="100%"
                              placeholder="Select country"
                              height="44px"
                              errors={errors?.countryOfResidence?.message}
                              handleSelect={(value) => {
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                          <ErrorMessage
                            message={
                              errors?.countryOfResidence?.message
                                ? errors?.countryOfResidence?.message
                                : ''
                            }
                          />
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-[30px] mt-[16px] mb-[32px]">
                      <AppInput
                        label="First name"
                        placeholder="Enter first name"
                        fullWidth
                        animated={false}
                        register={register('firstName', {
                          required: true,
                        })}
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
                        label="Last name"
                        placeholder="Enter Last name"
                        fullWidth
                        animated={false}
                        register={register('lastName', {
                          required: true,
                        })}
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
                      <p className="mb-[6px]  text-[14px]  font-normal text-[#212121]"></p>

                      <div>
                        <AppInput
                          label=" Date of Birth"
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
                      Please capture and upload your ID or Passport and make
                      sure that all the details are clearly visible.
                    </p>
                  </div>
                </Grid>
                <Grid xs={12} md={6}>
                  <div
                    className={
                      'w-full flex flex-col md:flex-col sm:flex-col xl:flex-row 2xl:flex-row justify-between gap-[30px]'
                    }
                  >
                    <div className={'w-full'}>
                      <ImageUploader
                        type={TYPE_UPDATE_IMAGE.EKYC_FRONT}
                        files={fileFront}
                        isPrivate={true}
                        name={'Front ID'}
                        setFiles={setFileFront}
                        errors={errors?.frontUrl?.message}
                      />

                      <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                        <ErrorMessage
                          message={
                            errors?.frontUrl?.message
                              ? errors?.frontUrl?.message
                              : ''
                          }
                        />
                      </p>
                    </div>

                    <div className={'w-full'}>
                      <ImageUploader
                        type={TYPE_UPDATE_IMAGE.EKYC_BACK}
                        files={fileBack}
                        isPrivate={true}
                        name={'Back ID'}
                        setFiles={setFileBack}
                        errors={errors?.backUrl?.message}
                      />
                      <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                        <ErrorMessage
                          message={
                            errors?.backUrl?.message
                              ? errors?.backUrl?.message
                              : ''
                          }
                        />
                      </p>
                    </div>
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
                    <div>
                      <ImageUploader
                        type={TYPE_UPDATE_IMAGE.EKYC_SELFIE}
                        files={fileSelfi}
                        setFiles={setFileSelfi}
                        name={'Selfie image'}
                        isPrivate={true}
                        errors={errors?.selfie?.message}
                      />
                      <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                        <ErrorMessage
                          message={
                            errors?.selfie?.message
                              ? errors?.selfie?.message
                              : ''
                          }
                        />
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid.Container>
            </Section>
            <div className="border-b" />
            <Section>
              <Grid.Container gap={2} justify="center">
                <Grid xs={12} md={12} className="text-[#E94F37] text-[16px]">
                  Personal information, ID Documents, Take the Selfie with your
                  ID Documents only verify one time. Please make sure that all
                  information is correct.
                </Grid>
              </Grid.Container>
            </Section>
          </>
        );
    }
  };

  return (
    <>
      <form onSubmit={() => handleSubmit(onSubmit)}>
        <Section>
          <Grid.Container gap={2} justify="center">
            <Grid xs={12} md={6}>
              <div>
                <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                  Project title
                </p>
                <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                  Add the checking account where you want to receive funds. Make
                  sure that all your details are correct - you can’t change them
                  after clicking submit. Clever Launch only supports{' '}
                  <span className="text-[#E94F37]">USDT - ERC20</span> at the
                  moment.
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <div>
                  <AppInput
                    label="Blockchain wallet address"
                    placeholder="Enter your ERC20 wallet address"
                    fullWidth
                    animated={false}
                    bordered
                    register={register('walletAddress', {
                      required: true,
                    })}
                    helperText={`${
                      errors?.walletAddress?.message
                        ? errors?.walletAddress?.message
                        : ''
                    }`}
                    color={`${
                      errors?.walletAddress?.message ? 'error' : 'default'
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
                  Contact email
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <div>
                  <AppInput
                    label="Email"
                    placeholder="Enter email"
                    fullWidth
                    animated={false}
                    bordered
                    register={register('contactEmail', {
                      required: true,
                    })}
                    helperText={`${
                      errors?.contactEmail?.message
                        ? errors?.contactEmail?.message
                        : ''
                    }`}
                    color={`${
                      errors?.contactEmail?.message ? 'error' : 'default'
                    }`}
                  />
                </div>
              </div>
            </Grid>
          </Grid.Container>
        </Section>

        <div className="border-b" />
        {renderKYC(eKycStatus)}

        <ButtonSubmit onClick={handleSubmit(onSubmit)} tab={tab} />
      </form>
    </>
  );
}

export default Verification;
