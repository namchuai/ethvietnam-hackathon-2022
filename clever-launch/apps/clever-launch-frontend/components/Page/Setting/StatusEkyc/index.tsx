import React from 'react';
import Section from '../../../Common/AppSection';
interface IStatusEkyc {
  status: string;
}
function StatusEkyc({ status }: IStatusEkyc) {
  function renderEkyc(status) {
    switch (status) {
      case (status = 'InReview'):
        return (
          <div className={'h-[300px]'}>
            <img src={'/assets/icon/ekyc-process.svg'} />
            <h3 className={'mt-[20px] text-[20px] mb-3 text-[#4D4D4D]'}>
              Processing
            </h3>
            <p className={'text-base'}>
              We are in the process of approving your information, You will get
              the results soon.
            </p>
          </div>
        );
        break;
      case (status = 'Successful'):
        return (
          <div className={'h-[300px]'}>
            <img src={'/assets/icon/ekyc-done.svg'} />
            <h3 className={'mt-[20px] text-[20px] mb-3 text-[#4D4D4D]'}>
              Verify success
            </h3>
            <p className={'text-base'}>
              Your account has been verified successfully
            </p>
          </div>
        );
        break;
      case (status = 'ReviewFailed'):
        return (
          <div className={'h-[300px]'}>
            <img src={'/assets/icon/ekyc-process.svg'} />
            <h3 className={'mt-[20px] text-[20px] mb-3 text-[#4D4D4D]'}>
              Verify Failed
            </h3>
            <p className={'text-base'}>Your account has been verified Failed</p>
          </div>
        );
        break;
    }
  }
  return <Section>{renderEkyc(status)}</Section>;
}

export default StatusEkyc;
