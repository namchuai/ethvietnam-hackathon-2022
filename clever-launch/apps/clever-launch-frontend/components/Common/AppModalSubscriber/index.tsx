import React from 'react';
import { Modal, Text, Row, Checkbox, Radio } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../Base/UI/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppInput from '../AppInput';
import useMobile from '../../../hooks/useMobile';
import AppButton from '../AppButton';
import color from '../../Base/theme/base/colors';
import { userService } from '../../../services';
import { toast, ToastContainer } from 'react-toastify';

const schema = yup
  .object({
    email: yup.string().email().required('Email is required'),
    name: yup.string().required('User Name is required'),
  })
  .required();

export default function ModalSubscriber() {
  const [visible, setVisible] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: false,
    defaultValues: {
      subscriberType: 'Backer',
      email: '',
      name: '',
    },
  });

  const isMobile = useMobile();

  const handler = () => setVisible(true);

  const onSubmit = async (data) => {
    try {
      await userService.subscriberUser(data);
      toast.info('Subscriber Success !', {
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
      toast.error(e?.response?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } finally {
      setVisible(false);
      reset({
        email: '',
        name: '',
        subscriberType: 'Backer',
      });
    }
  };

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <div className={'w-full md:w-auto mt-8'}>
      <ToastContainer />
      <AppButton auto onClick={handler} bgCustom={`${color.orange['300']}`}>
        Subscribe
      </AppButton>
      <Modal
        css={{
          borderRadius: `${isMobile && '0px'}`,
          height: `${isMobile && '100vh'}`,
          marginTop: `${isMobile && '-15px'}`,
          paddingBottom: '20px',
        }}
        closeButton={false}
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Row
          justify="space-between"
          align={'center'}
          style={{
            borderBottom: '1px solid #80808063',
            padding: '10px 24px 15px 24px',
          }}
        >
          <Text size={16}>Join our newsletter</Text>
          <img onClick={closeHandler} src={'/assets/images/close.svg'} />
        </Row>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text size={14}>
              Get 50% OFF and be the first one to know about our projects and
              insight
            </Text>
            <div className={'mt-[20px]'} />
            <AppInput
              value={''}
              bordered
              fullWidth
              register={register('email')}
              name={'email'}
              label="Email*"
              size="lg"
              placeholder="Email"
              helperText={`${
                errors?.email?.message ? errors?.email?.message : ''
              }`}
              color={`${errors?.email?.message ? 'error' : 'default'}`}
            />
            <div className={'mt-[25px]'} />

            <AppInput
              value={''}
              bordered
              fullWidth
              register={register('name')}
              name={'name'}
              label="Username *"
              size="lg"
              placeholder="Email"
              helperText={`${
                errors?.name?.message ? errors?.name?.message : ''
              }`}
              color={`${errors?.name?.message ? 'error' : 'default'}`}
            />

            <div className={'mt-[25px]'} />
            <p className={'mb-[20px]'}>You are *</p>
            <Controller
              render={({ field }) => {
                return (
                  <Radio.Group
                    defaultValue={'Backer'}
                    // value={getValues('fundRaisingMethod')}
                    onChange={(value) => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                      field.onChange(value);
                      // setTypeMethod(value);
                    }}
                    ref={field.ref}
                  >
                    <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full rounded-[8px]">
                      <Radio
                        value="Backer"
                        css={{
                          '& .nextui-c-hPBoDr': {
                            fontSize: 16,
                            color: '#212121',
                          },
                        }}
                      >
                        <span className={'ml-[10px]'}>
                          Backer - Looking for creative project to invest/donate
                        </span>
                      </Radio>
                    </div>

                    <div className="p-[16px] border border-[#E4E7EC] mb-[24px] w-full rounded-[8px]">
                      <Radio
                        value="Creator"
                        css={{
                          '& .nextui-c-hPBoDr': {
                            fontSize: 16,
                            color: '#212121',
                          },
                        }}
                      >
                        <span className={'ml-[10px]'}>
                          Creator - looking for funding of your project
                        </span>
                      </Radio>
                    </div>
                  </Radio.Group>
                );
              }}
              name={'subscriberType'}
              control={control}
              defaultValue={'Backer'}
            />
          </form>
          <Button
            onClick={handleSubmit(onSubmit)}
            className={'bg-[#E8AA42]'}
            fullWidth={true}
          >
            Subscribe
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
