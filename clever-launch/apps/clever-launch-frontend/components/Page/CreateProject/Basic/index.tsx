import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Grid, Radio } from '@nextui-org/react';
import AppInput from 'apps/clever-launch-frontend/components/Common/AppInput';
import TextareaApp from 'apps/clever-launch-frontend/components/Common/AppTextArea';
import ModalAddTag from '../Components/Modal/ModalAddTag';
import Section from '../../../Common/AppSection';
import ImageUploader from 'apps/clever-launch-frontend/components/Common/AppSingleUploader';
import { TYPE_UPDATE_IMAGE } from 'apps/clever-launch-frontend/constants/upload';
import ButtonSubmit from '../Components/Button';
import { useEffect, useState } from 'react';
import ErrorMessage from '../Components/ErrorMessage';
import {
  getPendingProject,
  updateProjectPending,
} from 'apps/clever-launch-frontend/services/create-project';
import {
  formatValue,
  updateTextView,
} from 'apps/clever-launch-frontend/utils/formatValue';
import { useRouter } from 'next/router';
import { TABS } from 'apps/clever-launch-frontend/constants/tabs';
const numeral = require('numeral');

interface BasicProps {
  projectId?: string;
  setTypeMethodFundraising?: any;
}

interface Inittype {
  title: string;
  subTitle: string;
  fundingGoal: number;
  durationInDay: string;
  tags: string | Array<any>;
  introType: 'Image';
  imageProject: string;
  introUrl: string;
  fundRaisingMethod: 'LookingForDonors';
  pitchDeckUrl: string;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subTitle: yup.string().required('subTitle is required'),
  tags: yup.array().min(1).max(2),
  introType: yup.string().required('typeProjectImage is required'),
  imageProject: yup.string().when('introType', {
    is: (introType) => introType === 'Image',
    then: yup.string().required('Project image is required'),
  }),
  introUrl: yup.string().when('introType', {
    is: (introType) => introType === 'Video',
    then: yup.string().required('videoUrl is required'),
  }),
  fundRaisingMethod: yup.string().required('fundRaisingMethod is required'),
  pitchDeckUrl: yup.string().when('fundRaisingMethod', {
    is: (fundRaisingMethod) => fundRaisingMethod === 'LookingForInvestors',
    then: yup.string().required('Pitch deck image is required'),
  }),
  fundingGoal: yup.number().when('fundRaisingMethod', {
    is: (fundRaisingMethod) => fundRaisingMethod === 'LookingForDonors',
    then: yup.number().required(' Goal amount is required'),
  }),

  durationInDay: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .when('fundRaisingMethod', {
      is: (fundRaisingMethod) => fundRaisingMethod === 'LookingForDonors',
      then: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .moreThan(0)
        .lessThan(61)
        .required('Number of day is required'),
    }),
});

const initialValue: Inittype = {
  title: '',
  subTitle: '',
  fundingGoal: null,
  durationInDay: '',
  tags: '',
  introType: 'Image',
  imageProject: '',
  introUrl: '',
  fundRaisingMethod: 'LookingForDonors',
  pitchDeckUrl: '',
};

function Basic({
  projectId,
  setTypeMethodFundraising,
}: BasicProps): JSX.Element {
  const [fileIntro, setFileIntro] = useState([]);
  const [filePitch, setFilePitch] = useState([]);
  const [type, setType] = useState('Image');
  const [typeMethod, setTypeMethod] = useState('LookingForDonors');
  const [urlVideo, setUrlVideo] = useState('');
  const [listTagSelected, setListTagSelected] = useState([]);
  const [idTagArr, setIdTagArr] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [countTitle, setCountTitle] = useState(0);
  const [countTextArea, setCountTextArea] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
    defaultValues: initialValue,
  });

  useEffect(() => {
    setTypeMethodFundraising && setTypeMethodFundraising(typeMethod);
  }, [typeMethod]);

  const handleApply = () => {
    const result = idTagArr.map((id) => {
      return listTag.find((item) => Number(item.id) == Number(id));
    });
    setIsShow(false);
    const final = new Set([...listTagSelected, ...result]);
    setListTagSelected([...final]);
    setValue('tags', [...final]);
  };

  const remove = (index: number, id: number) => {
    const newArrTagSelected = [...listTagSelected];
    newArrTagSelected.splice(index, 1);
    setListTagSelected([...newArrTagSelected]);
    setValue('tags', [...newArrTagSelected]);
    const newArrId = [...idTagArr];
    const newResult = newArrId.filter((item) => Number(item) != Number(id));
    setIdTagArr([...newResult]);
  };

  const onSubmit = async (data) => {
    const dataAdd = {
      ...data,
      introUrl: type === 'Image' ? data.imageProject : data.introUrl,
      pitchDeckUrl:
        data.fundRaisingMethod === 'LookingForInvestors'
          ? data.pitchDeckUrl
          : '',
      fundingGoal:
        data.fundRaisingMethod !== 'LookingForInvestors'
          ? data.fundingGoal
          : '',
      durationInDay:
        data.fundRaisingMethod !== 'LookingForInvestors'
          ? data.durationInDay
          : undefined,
      imageProject: undefined,
    };

    try {
      const { status } = await updateProjectPending(formatValue(dataAdd));
      if (status == 200 || status == 201) {
        router.push({
          pathname: '/create-project/[id]',
          query: {
            id: `${projectId}`,
            tab: typeMethod === 'LookingForDonors' ? TABS.REWARD : TABS.STORY,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProjectPending = async () => {
    try {
      const { data, status } = await getPendingProject({});
      if (status == 200 && Object.keys(data).length != 0 && data?.title) {
        setValue('title', data?.title);
        setValue('subTitle', data?.subTitle);
        setValue('tags', data?.tags);
        setListTagSelected(data?.tags);
        setType(data?.introType);
        setValue('introType', data?.introType);
        setUrlVideo(
          data?.introType === 'Video'
            ? data?.introUrl
              ? data?.introUrl
              : ''
            : ''
        );
        setFileIntro(
          data?.introType === 'Image'
            ? data?.introUrl
              ? [{ url: data?.introUrl }]
              : []
            : []
        );
        setFilePitch(
          data?.fundRaisingMethod === 'LookingForInvestors'
            ? data?.pitchDeckUrl
              ? [{ url: data?.pitchDeckUrl }]
              : []
            : []
        );
        setValue('fundRaisingMethod', data?.fundRaisingMethod);
        setValue('fundingGoal', data?.fundingGoal);
        setValue('durationInDay', data?.durationInDay);
        setTypeMethod(data.fundRaisingMethod);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetProjectPending();
  }, []);

  useEffect(() => {
    setValue('introUrl', urlVideo);
  }, [urlVideo]);

  useEffect(() => {
    if (fileIntro?.length > 0) {
      setValue('imageProject', fileIntro[0]?.url);
      clearErrors('imageProject');
    } else {
      setValue('imageProject', '');
    }
  }, [fileIntro]);

  useEffect(() => {
    if (filePitch?.length > 0) {
      setValue('pitchDeckUrl', filePitch[0]?.url);
      clearErrors('pitchDeckUrl');
    } else {
      setValue('pitchDeckUrl', '');
    }
  }, [filePitch]);

  useEffect(() => {
    if (listTagSelected?.length > 0) {
      clearErrors(['tags']);
    }
  }, [listTagSelected]);

  useEffect(() => {
    type === 'Image'
      ? setValue('imageProject', fileIntro[0]?.url ? fileIntro[0]?.url : '')
      : setValue('introUrl', urlVideo);
  }, [type]);

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
                  Write a clear, brief title and subtitle to help people quickly
                  understand your project. Both will appear on your project and
                  pre-launch pages.
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <div className="mb-[16px]">
                  <AppInput
                    label="Title"
                    placeholder="Enter name project"
                    id={'basic_title'}
                    bordered
                    fullWidth
                    maxLength={60}
                    register={register('title', {
                      required: true,
                      onChange: (e) => setCountTitle(e.target.value.length),
                    })}
                    helperText={`${
                      errors?.title?.message ? errors?.title?.message : ''
                    }`}
                    color={`${errors?.title?.message ? 'error' : 'default'}`}
                  />
                  <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                    {watch('title').length || 0}/60
                  </p>
                </div>
                <div>
                  <TextareaApp
                    label="Subtile"
                    fullWidth
                    initialValue=""
                    css={{ borderRadius: 8 }}
                    className={'subtitle'}
                    placeholder="Enter your subtitle"
                    cacheMeasurements
                    bordered
                    maxLength={135}
                    maxRows={7}
                    minRows={3}
                    register={register('subTitle', {
                      required: true,
                      onChange: (e) => setCountTextArea(e.target.value.length),
                    })}
                    helperText={`${
                      errors?.subTitle?.message ? errors?.subTitle?.message : ''
                    }`}
                    color={`${errors?.subTitle?.message ? 'error' : 'default'}`}
                  />
                  <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                    {watch('subTitle').length || 0}/135
                  </p>
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
                  Project tag
                </p>
                <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                  Choose a tag or mutilple tag to help backers find your
                  project.
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <p
                  className={`font-normal  ${
                    errors?.tags?.message ? `text-[#F31260]` : 'text-[#212121]'
                  }  text-[14px] mb-[6px]`}
                >
                  Tag
                </p>
                <div className="flex gap-[12px]">
                  {listTagSelected?.map((item, index) => {
                    return (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          remove(index, Number(item.id));
                        }}
                        key={index}
                        className="py-[10px] px-[16px] font-normal
                     text-[#344054] text-[14px] border border-[#E4E7EC]
                     rounded-[8px] flex items-center gap-[13px]
                     bg-[#E4E7EC]
                     "
                      >
                        {item?.title}
                        <img src="/assets/create-project/delete.svg" alt="" />
                      </button>
                    );
                  })}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsShow(true);
                    }}
                    className="py-[10px] px-[16px] font-normal text-[#344054]
                    text-[14px] border border-[#E4E7EC] rounded-[8px]
                    flex items-center gap-[13px]"
                  >
                    <img src="/assets/create-project/plus-icon.svg" alt="" />
                    Add tag
                  </button>
                </div>
                {
                  <p className="flex justify-start font-normal  text-[9px] mt-[5px]">
                    {errors?.tags?.message &&
                    Array.from(listTagSelected).length == 0
                      ? 'Tags is required'
                      : ''}
                  </p>
                }
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
                  Project image or video
                </p>
                <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                  <p>
                    Add an image or video that clearly represents your project.
                    Choose one that looks good at different sizes—it’ll appear
                    on your project page, across computer screen and mobile
                    screen.
                  </p>
                  <p className="my-[16px]">
                    Your image should be at least 1024x576 pixels. It will be
                    cropped to a 16:9 ratio.
                  </p>
                  <p>
                    If you choose use video description, your video should
                    uploaded on Youtube or Vimeo. It still will be cropped to
                    16:9 ratio.
                  </p>
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <div className="mb-[40px]">
                  <Controller
                    render={({ field }) => {
                      return (
                        <Radio.Group
                          defaultValue={'Image'}
                          value={getValues('introType')}
                          onChange={(value) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            field.onChange(value);
                            setType(value);
                          }}
                        >
                          <div className="flex items-center gap-[50px]">
                            <Radio
                              value="Image"
                              css={{
                                '& .nextui-c-hPBoDr': {
                                  fontSize: 16,
                                  color: '#212121',
                                },
                              }}
                            >
                              Image description
                            </Radio>

                            <Radio
                              value="Video"
                              css={{
                                '& .nextui-c-hPBoDr': {
                                  fontSize: 16,
                                  color: '#212121',
                                },
                                '&': {
                                  marginTop: '0px !important',
                                },
                              }}
                            >
                              Video description
                            </Radio>
                          </div>
                        </Radio.Group>
                      );
                    }}
                    name="introType"
                    control={control}
                    defaultValue={'Image'}
                  />
                </div>
                {type === 'Video' ? (
                  <AppInput
                    label="Enter link video (Youtube, Vimeo)"
                    placeholder="Enter link"
                    bordered
                    fullWidth
                    register={register('introUrl', {
                      required: true,
                      onChange: (e) => setUrlVideo(e.target.value),
                    })}
                    helperText={`${
                      errors?.introUrl?.message ? errors?.introUrl?.message : ''
                    }`}
                    color={`${errors?.introUrl?.message ? 'error' : 'default'}`}
                  />
                ) : (
                  <>
                    <ImageUploader
                      type={TYPE_UPDATE_IMAGE.INTRO}
                      files={fileIntro}
                      setFiles={setFileIntro}
                      isPrivate={false}
                      pid={projectId}
                      errors={errors?.imageProject?.message}
                    />
                    <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                      <ErrorMessage
                        message={
                          errors?.imageProject?.message
                            ? errors?.imageProject?.message
                            : ''
                        }
                      />
                    </p>
                  </>
                )}
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
                  Methods of fundraising
                </p>
                <p className="full-w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                  <p>Select methods of fundraising</p>
                  {typeMethod === 'LookingForDonors' ? (
                    <p className="my-[16px]">
                      Looking for Donors: finding individuals to donate with or
                      without rewards.
                    </p>
                  ) : (
                    <p className="my-[16px]">
                      Looking for Investors: finding investment from Clever
                      Launch Treasury Fund via DAO (Decentralized Autonomous
                      Organization) community governance.
                    </p>
                  )}
                </p>
              </div>
            </Grid>
            <Grid xs={12} md={6}>
              <div className={'w-full'}>
                <Controller
                  render={({ field }) => {
                    return (
                      <Radio.Group
                        defaultValue={'LookingForDonors'}
                        value={getValues('fundRaisingMethod')}
                        onChange={(value) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          field.onChange(value);
                          setTypeMethod(value);
                        }}
                        ref={field.ref}
                      >
                        <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full md:w-[485px] rounded-[8px]">
                          <Radio
                            value="LookingForDonors"
                            css={{
                              '& .nextui-c-hPBoDr': {
                                fontSize: 16,
                                color: '#212121',
                              },
                            }}
                          >
                            Looking for Donors
                          </Radio>
                        </div>

                        <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full md:w-[485px] rounded-[8px]">
                          <Radio
                            value="LookingForInvestors"
                            css={{
                              '& .nextui-c-hPBoDr': {
                                fontSize: 16,
                                color: '#212121',
                              },
                            }}
                          >
                            Looking for Investors
                          </Radio>
                        </div>
                      </Radio.Group>
                    );
                  }}
                  name={'fundRaisingMethod'}
                  control={control}
                  defaultValue={'LookingForDonors'}
                />
              </div>
            </Grid>
          </Grid.Container>
        </Section>

        <div className="border-b" />

        <Section>
          <Grid.Container gap={2} justify="center">
            <>
              {watch('fundRaisingMethod') == 'LookingForDonors' ? (
                <>
                  <Grid xs={12} md={6}>
                    <div>
                      <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                        Funding goal (Looking for Donors)
                      </p>
                      <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                        Set an achievable goal that covers what you need to
                        complete your project. Funding is all-or-nothing. If you
                        don’t meet your goal, you won’t receive any money.
                        CleverLaunch charges a{' '}
                        <span className="text-[#E94F37]">5% fee </span> if your
                        project meets your goal, so carefully calculate the
                        funding goal.
                      </p>
                    </div>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <div className={'w-full'}>
                      <AppInput
                        label="Goal Amount"
                        fullWidth
                        placeholder="Enter amount"
                        contentRight={
                          <div className="flex">
                            <span className="ml-[-45px]">|</span>
                            <span className="ml-[8px] text-[16px]">USDT</span>
                          </div>
                        }
                        register={register('fundingGoal', {
                          required: true,
                          // onChange: (e) =>
                          //   setValue(
                          //     'fundingGoal',
                          //     updateTextView(e.target.value)
                          //   ),
                        })}
                        helperText={`${
                          errors?.fundingGoal?.message
                            ? errors?.fundingGoal?.message
                            : ''
                        }`}
                        color={`${
                          errors?.fundingGoal?.message ? 'error' : 'default'
                        }`}
                      />
                      <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                        1 USDT ~ 1 USD
                      </p>
                    </div>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid xs={12} md={6}>
                    <div>
                      <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                        Pitch deck (Looking for Investors)
                      </p>
                      <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                        <p>
                          Our community can support you in product & tokenomics
                          design, go-to-market and technical.
                        </p>
                        <p className="py-[16px]">
                          Your pitch deck should include detailed information
                          such as project description, team allocation, link to
                          production, traction, team detail & contact,
                          investment, and referral.
                        </p>

                        <p>
                          Our Clever Launch Foundation will validate your
                          project alongside professionals. We will contact you
                          for the next steps if you match our investment
                          criteria.
                        </p>
                      </p>
                    </div>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <div className={'w-full'}>
                      <div>
                        <ImageUploader
                          type={TYPE_UPDATE_IMAGE.PITCH_DECK}
                          files={filePitch}
                          setFiles={setFilePitch}
                          isPrivate={true}
                          isAcceptAllFile={true}
                          pid={projectId}
                          errors={errors?.pitchDeckUrl?.message}
                        />
                        <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                          <ErrorMessage
                            message={
                              errors?.pitchDeckUrl?.message
                                ? errors?.pitchDeckUrl?.message
                                : ''
                            }
                          />
                        </p>
                      </div>
                    </div>
                  </Grid>
                </>
              )}
            </>
          </Grid.Container>
        </Section>

        {watch('fundRaisingMethod') == 'LookingForDonors' && (
          <>
            <div className="border-b" />
            <Section>
              <Grid.Container gap={2} justify="center">
                <Grid xs={12} md={6}>
                  <div>
                    <p className="text-[18px] font-normal text-[#212121] mb-[20px]">
                      Campaign duration
                    </p>
                    <p className="w-full md:w-[443px] text-[#4D4D4D] text-[16px] font-normal">
                      Set a time limit for your campaign. You won’t be able to
                      change this after launching.
                    </p>
                  </div>
                </Grid>
                <Grid xs={12} md={6}>
                  <div className={'w-full'}>
                    <div>
                      <AppInput
                        label="Enter number of days"
                        fullWidth
                        placeholder="Enter amount"
                        register={register('durationInDay', {
                          required: true,
                        })}
                        helperText={`${
                          errors?.durationInDay?.message
                            ? 'Dration day must be a number type and have value between 1-60 '
                            : ''
                        }`}
                        color={`${
                          errors?.durationInDay?.message ? 'error' : 'default'
                        }`}
                      />
                      <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                        Value between 1-60
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid.Container>
            </Section>
          </>
        )}

        <ButtonSubmit onClick={handleSubmit(onSubmit)} />
      </form>

      <ModalAddTag
        listTag={listTag}
        isLimit={true}
        limit={2}
        visible={isShow}
        setListTagSelected={setListTagSelected}
        title="Add Tag"
        closeHandler={() => setIsShow(false)}
        idTagArr={idTagArr}
        setIdTagArr={setIdTagArr}
        handleApply={handleApply}
      />
    </>
  );
}

export default Basic;

const listTag = [
  {
    id: '1',
    title: 'Game',
    value: 'string',
    position: 0,
  },
  {
    id: '2',
    title: 'Art',
    value: 'string',
    position: 0,
  },
  {
    id: '3',
    title: 'Comic & illustration',
    value: 'string',
    position: 0,
  },

  {
    id: '4',
    title: 'Design & Tech',
    value: 'string',
    position: 0,
  },
  {
    id: '5',
    title: 'Social Media',
    value: 'string',
    position: 0,
  },
  {
    id: '6',
    title: 'Charity',
    value: 'string',
    position: 0,
  },
];
