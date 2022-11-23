import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BasicModal from 'apps/clever-launch-frontend/components/Common/BacsicModal';
import AppInput from 'apps/clever-launch-frontend/components/Common/AppInput';
import TextareaApp from 'apps/clever-launch-frontend/components/Common/AppTextArea';
import AppRadio from 'apps/clever-launch-frontend/components/Common/AppRadio';
import { useEffect, useState } from 'react';
import AppDropDown from 'apps/clever-launch-frontend/components/Common/AppDropDown';
import styled from 'styled-components';
import { IReward } from '../../..';
import { Grid, Radio } from '@nextui-org/react';
import ErrorMessage from '../../ErrorMessage';
import {
  createReward,
  updateReward,
} from 'apps/clever-launch-frontend/services/create-project';
import {
  formatValue,
  updateTextView,
} from 'apps/clever-launch-frontend/utils/formatValue';
import WrapModalReward from '../../../../../Common/WrapModalReward';

const Container = styled.div`
  &::-webkit-scrollbar:vertical {
    width: 13px;
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    -webkit-overflow-scrolling: auto;
    width: 13px;
  }

  &::-webkit-scrollbar-thumb {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #aaaaaa;
  }
`;

export interface IModalAddRewardProps {
  closeHandler?: any;
  visible?: any;
  handleGetReward?: any;
  projectId?: any;
  setIsOpenReWard?: any;
  rewardItem?: IReward;
  type?: any;
  id?: any;
  listYears: any;
}

const schema = yup
  .object({
    title: yup.string().required('Title is required'),
    totalAmount: yup.number().positive().required('Amount is required'),
    price: yup
      .number()
      .required('Price is required')
      .moreThan(0)
      .lessThan(10000),
    description: yup.string().required('Title is required'),
    estDeliveryMonth: yup.string().required('Delivery month is required'),
    estDeliveryYear: yup.string().required('Delivery year is required'),
    rewardType: yup.string().required('Reward type is required'),
    deliveryNote: yup.string().when('rewardType', {
      is: (deliveryNote) => deliveryNote !== 'Digital',
      then: yup.string().required('Delivery note is required'),
    }),
  })
  .required();

const initState = {
  title: '',
  totalAmount: '',
  price: '',
  description: '',
  estDeliveryMonth: '1',
  estDeliveryYear: '',
  rewardType: 'Physical',
  deliveryNote: '',
};

function ModalAddReward({
  closeHandler,
  visible,
  handleGetReward,
  projectId,
  setIsOpenReWard,
  rewardItem,
  type = undefined,
  id,
  listYears,
}: IModalAddRewardProps): JSX.Element {
  const [typeReward, setTypeReward] = useState('Physical');
  const [donate, setDonate] = useState(
    type === 'edit' ? rewardItem?.price : ''
  );
  const [countTextArea, setCountTextArea] = useState(0);
  console.log(rewardItem, 'items');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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

  const onSubmit = async (data: any) => {
    const dataAddCreate = {
      ...data,
      projectId,
      deliveryNote: data?.rewardType === 'Digital' ? '' : data?.deliveryNote,
      estDeliveryMonth: Number(data.estDeliveryMonth),
      estDeliveryYear: Number(data.estDeliveryYear),
      price: Number(data?.price),
    };

    const dataAddUpdate = {
      ...data,
      deliveryNote: data?.rewardType === 'Digital' ? '' : data?.deliveryNote,
      estDeliveryMonth: Number(data.estDeliveryMonth),
      estDeliveryYear: Number(data.estDeliveryYear),
      price: Number(data?.price),
    };

    try {
      if (type && type === 'edit') {
        const { status } = await updateReward({ ...dataAddUpdate, id });
        if (status == 200 || status == 201) {
          setIsOpenReWard(false);
          handleGetReward();
        }
      } else {
        const { status } = await createReward(dataAddCreate);
        if (status == 200 || status == 201) {
          handleGetReward();
          reset();
          setIsOpenReWard(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (type == 'edit' && rewardItem && Object.keys(rewardItem).length != 0) {
      setValue('estDeliveryMonth', String(rewardItem?.estDeliveryMonth));
      setValue('estDeliveryYear', String(rewardItem?.estDeliveryYear));
      setValue('title', rewardItem?.title);
      setValue('totalAmount', String(rewardItem?.totalAmount));
      setValue('price', rewardItem?.price);
      setValue('description', rewardItem?.description);
      setValue('deliveryNote', rewardItem?.deliveryNote);
      setValue('rewardType', rewardItem?.rewardType);
      setTypeReward(rewardItem?.rewardType);
    }
  }, [visible, rewardItem]);

  useEffect(() => {
    if (type !== 'edit' && listYears?.length > 0) {
      setValue('estDeliveryYear', listYears[0].value);
    }
  }, [listYears]);

  return (
    <WrapModalReward
      title={'Add new reward'}
      closeHandler={closeHandler}
      visible={visible}
      width={'100vw'}
    >
      <form
        className={'md:px-[114px] md:py-[40px]'}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid.Container gap={0} justify="center">
          <Grid xs={12} md={6}>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full p-[10px] md:p-0">
                <div className="mb-[32px]">
                  <AppInput
                    fullWidth
                    placeholder="Enter name reward"
                    label="Title"
                    maxLength={30}
                    bordered
                    register={register('title', {
                      required: true,
                    })}
                    helperText={`${
                      errors?.title?.message ? errors?.title?.message : ''
                    }`}
                    color={`${errors?.title?.message ? 'error' : 'default'}`}
                  />
                  <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                    {watch('title').length || 0}/30
                  </p>
                </div>

                <div className="mb-[16px]">
                  <AppInput
                    fullWidth
                    placeholder="Enter amount"
                    label="Amount"
                    contentRight={
                      <div className="flex">
                        <span>|</span>{' '}
                        <span className="ml-[8px] text-[16px]">USDT</span>
                      </div>
                    }
                    css={{
                      '& .nextui-c-PJLV-dBGXHd-applyStyles-true': {
                        marginRight: '35px',
                      },
                    }}
                    register={register('price', {
                      required: true,
                      onChange: (e) => {
                        setDonate(e.target.value);
                        // setValue('price', updateTextView(e.target.value));
                      },
                    })}
                    helperText={`${
                      errors?.price?.message ? 'Price is invalid' : ''
                    }`}
                    color={`${errors?.price?.message ? 'error' : 'default'}`}
                  />
                  <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                    1 USDT ~ 1 USD, enter value between 1-10,000
                  </p>
                </div>

                <div className="mb-[32px]">
                  <AppInput
                    fullWidth
                    placeholder="Enter quantity"
                    label="Quantity"
                    bordered
                    register={register('totalAmount', {
                      required: true,
                    })}
                    helperText={`${
                      errors?.totalAmount?.message ? 'Quantity is invalid' : ''
                    }`}
                    color={`${
                      errors?.totalAmount?.message ? 'error' : 'default'
                    }`}
                  />
                </div>

                <div className="mb-[16px]">
                  <TextareaApp
                    fullWidth
                    initialValue=""
                    defaultValue={''}
                    label="Description"
                    className={'subtitle'}
                    placeholder="Enter your amazing ideas."
                    cacheMeasurements
                    maxRows={7}
                    minRows={3}
                    maxLength={135}
                    register={register('description', {
                      required: true,
                      onChange: (e) => setCountTextArea(e.target.value.length),
                    })}
                    helperText={`${
                      errors?.description?.message
                        ? 'Description is invalid'
                        : ''
                    }`}
                    color={`${
                      errors?.description?.message ? 'error' : 'default'
                    }`}
                  />
                  <p className="flex mt-[6px] justify-end font-normal text-[#B4B4B4] text-[12px]">
                    {watch('description').length || 0}/135
                  </p>
                </div>

                <div className="mb-[16px] mt-[40px]">
                  <p
                    className={`text-start text-[14px] font-normal
                     ${
                       errors?.estDeliveryMonth?.message ||
                       errors?.estDeliveryYear?.message
                         ? 'text-[#F31260]'
                         : ' text-[#212121]'
                     } mb-[6px]`}
                  >
                    Estimate Delivery Date
                  </p>
                  <div className="flex gap-[13px]">
                    <div>
                      <Controller
                        control={control}
                        name="estDeliveryMonth"
                        render={({ field }) => (
                          <AppDropDown
                            selectList={optionsMonth}
                            width="146px"
                            placeholder="Month"
                            height="44px"
                            value={getValues('estDeliveryMonth')}
                            errors={errors?.estDeliveryMonth?.message}
                            handleSelect={(value) => {
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                      <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                        <ErrorMessage
                          message={
                            errors?.estDeliveryMonth?.message
                              ? errors?.estDeliveryMonth?.message
                              : ''
                          }
                        />
                      </p>
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="estDeliveryYear"
                        render={({ field }) => (
                          <AppDropDown
                            selectList={listYears}
                            width="146px"
                            placeholder="Year"
                            height="44px"
                            value={getValues('estDeliveryYear')}
                            errors={errors?.estDeliveryYear?.message}
                            handleSelect={(value) => {
                              field.onChange(value);
                            }}
                          />
                        )}
                      />
                      <p className="flex justify-start font-normal  text-[10px] mt-[6px]">
                        <ErrorMessage
                          message={
                            errors?.estDeliveryYear?.message
                              ? errors?.estDeliveryYear?.message
                              : ''
                          }
                        />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-[30px] mt-[38px]">
                  <p className="text-start text-[14px] font-normal text-[#212121] mb-[6px]">
                    Type of reward
                  </p>
                  <Controller
                    render={({ field }) => {
                      return (
                        <Radio.Group
                          defaultValue={'Physical'}
                          value={getValues('rewardType')}
                          onChange={(value) => {
                            field.onChange(value);
                            setTypeReward(value);
                          }}
                        >
                          <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full md:w-[485px] rounded-[8px] ">
                            <Radio
                              value="Physical"
                              css={{
                                '& .nextui-c-hPBoDr': {
                                  fontSize: 16,
                                  color: '#212121',
                                },
                              }}
                            >
                              Physical
                            </Radio>
                          </div>

                          <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full md:w-[485px] rounded-[8px]">
                            <Radio
                              value="Digital"
                              css={{
                                '& .nextui-c-hPBoDr': {
                                  fontSize: 16,
                                  color: '#212121',
                                },
                              }}
                            >
                              Digital
                            </Radio>
                          </div>

                          <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full md:w-[485px] rounded-[8px]">
                            <Radio
                              value="Physical and digital"
                              css={{
                                '& .nextui-c-hPBoDr': {
                                  fontSize: 16,
                                  color: '#212121',
                                },
                              }}
                            >
                              Both Physical & Digital
                            </Radio>
                          </div>
                        </Radio.Group>
                      );
                    }}
                    name="rewardType"
                    control={control}
                    defaultValue={'Physical'}
                  />
                </div>

                {watch('rewardType') !== 'Digital' && (
                  <div className="mb-[16px]">
                    <TextareaApp
                      fullWidth
                      initialValue=""
                      label="Country or Region support delivery"
                      defaultValue={''}
                      className={'subtitle'}
                      placeholder="Enter your country."
                      cacheMeasurements
                      maxRows={7}
                      minRows={3}
                      register={register('deliveryNote', { required: true })}
                      helperText={`${
                        errors?.deliveryNote?.message
                          ? errors?.deliveryNote?.message
                          : ''
                      }`}
                      color={`${
                        errors?.deliveryNote?.message ? 'error' : 'default'
                      }`}
                    />
                  </div>
                )}

                <div className="text-start font-normal text-[#B4B4B4] text-[14px] mt-[22px]">
                  Shipping is an agreement between the donator and the project
                  owner. Clever Launch is not responsible for this service.
                </div>
              </div>
            </div>
          </Grid>
          <Grid xs={12} md={6} justify="center">
            <div className="mt-[30px] md:mt-0 mb-[16px] p-[10px] md:p-0">
              <p className="text-start text-[18px] font-normal text-[#212121]">
                Preview Reward
              </p>
              <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-[8px] mb-[24px]">
                Get a glimpse of how this reward will look on your project page.
              </p>
              <div className="w-full md:w-[384px] p-[24px]  border border-[#E4E7EC] rounded-[8px]">
                <p className="text-start">
                  Donate{' '}
                  {!errors?.price ? (watch('price') ? watch('price') : 0) : 0}{' '}
                  USDT or more
                </p>
                <p className="text-start  text-[18px] font-semibold text-[#212121] my-[20px] break-words">
                  {watch('title')}
                </p>
                <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-2 break-words">
                  {watch('description')}
                </p>
                <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-2 break-words">
                  ESTIMATE DELIVERY:
                </p>
                <p className="text-start text-[16px] font-normal text-[#4D4D4D] mb-[20px]">
                  {actionMapName[watch('estDeliveryMonth')] || ''},{' '}
                  {watch('estDeliveryYear')}
                </p>
                {watch('rewardType') !== 'Digital' && (
                  <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                    COUNTRY SUPPORT DELIVERY:
                  </p>
                )}

                {watch('rewardType') !== 'Digital' && (
                  <p className="text-start text-[16px] font-normal text-[#4D4D4D]">
                    {' '}
                    {watch('deliveryNote')}
                  </p>
                )}
                <p className="text-start text-[16px] font-normal text-[#4D4D4D] mt-2 break-words">
                  {`Limited (${watch('totalAmount')} left of ${watch(
                    'totalAmount'
                  )})`}
                </p>
                <button className="w-full py-[12px] px-[20px] text-[16px] font-normal text-[#212121] bg-[#E4E7EC] mt-[24px] rounded-[8px]">
                  Donate{' '}
                  {!errors?.price ? (watch('price') ? watch('price') : 0) : 0} $
                  or more
                </button>
              </div>
            </div>
          </Grid>
        </Grid.Container>
        <Grid.Container gap={0} justify="center">
          <Grid xs={12} md={12}>
            <div className="flex justify-start mt-2 md:mt-[64px]">
              <button
                aria-label="handleAddReward"
                onClick={handleSubmit(onSubmit)}
                className="bg-[#E8AA42] rounded-[8px] text-[16px] font-normal text-[#212121]  py-[8px] px-[18px]"
              >
                Save reward
              </button>
            </div>
          </Grid>
        </Grid.Container>
      </form>
    </WrapModalReward>
  );
}

export const optionsYear = [
  {
    value: '2022',
    id: 2022,
    name: '2022',
  },
  {
    value: '2023',
    id: 2023,
    name: '2023',
  },
  {
    value: '2024',
    id: 2024,
    name: '2024',
  },
];
export const optionsMonth = [
  {
    value: '1',
    id: 1,
    name: 'January',
  },
  {
    value: '2',
    id: 2,
    name: 'February',
  },
  {
    value: '3',
    id: 3,
    name: 'March',
  },
  {
    value: '4',
    id: 4,
    name: 'April',
  },
  {
    value: '5',
    id: 5,
    name: 'May',
  },
  {
    value: '6',
    id: 6,
    name: 'June',
  },
  {
    value: '7',
    id: 7,
    name: 'July',
  },
  {
    value: '8',
    id: 8,
    name: 'August',
  },
  {
    value: '9',
    id: 9,
    name: 'September',
  },
  {
    value: '10',
    id: 10,
    name: 'October',
  },
  {
    value: '11',
    id: 11,
    name: 'November',
  },
  {
    value: '12',
    id: 12,
    name: 'December',
  },
];

export const actionMapName = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

export default ModalAddReward;
