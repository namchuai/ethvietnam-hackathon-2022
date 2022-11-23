import { useRouter } from 'next/router';
import styled from 'styled-components';
import { EkycStatus } from '../../../constants/status-ekyc';

const SpinnerContainer = styled.div`
  img {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Processing = ({ isProcessing, setIsUpLoad, ekycStatus }) => {
  const route = useRouter();
  return (
    <div className="w-full mt-[30px]">
      <div className="main-content w-full h-[69vh] mt-[80px]">
        {isProcessing ? (
          <>
            <div className="w-full flex justify-center">
              <SpinnerContainer className="h-[48px] w-[48px] flex rounded-[50%] bg-[#212121] justify-center items-center ">
                {ekycStatus === EkycStatus.Successful ? (
                  <img
                    src="/assets/create-project/success.svg"
                    alt="processingIcon"
                  />
                ) : (
                  <img
                    src="/assets/create-project/processing.svg"
                    alt="processingIcon"
                  />
                )}
              </SpinnerContainer>
            </div>
            <p className="text-[#4D4D4D] text-[20px] font-semibold text-center mt-[20px]">
              {ekycStatus === EkycStatus.Successful
                ? 'Project published'
                : 'Processing'}
            </p>
            <p className="test text-[16px] text-[#4D4D4D] font-normal text-center">
              {ekycStatus === EkycStatus.Successful
                ? 'Project post has been published.'
                : 'We are in the process of approving your information, You will getthe results soon.'}
            </p>

            <div className="w-full flex justify-center mt-[24px] ">
              <button
                className="px-[14px] py-[8px] gap-[13px] flex justify-center
               items-center rounded-[8px] border
                border-[#E4E7EC] bg-[#F9FAFB]"
              >
                <span
                  onClick={() => {
                    route.push('/project');
                    setIsUpLoad(false);
                  }}
                >
                  Go project page
                </span>
                <img src="/assets/create-project/right.svg" alt="rightIcon" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex justify-center">
              <div className="h-[48px] w-[48px] flex rounded-[50%] bg-[#2A4D14] justify-center items-center ">
                <img
                  src="/assets/create-project/success.svg"
                  alt="processingIcon"
                />
              </div>
            </div>

            <p className="text-[#4D4D4D] text-[20px] font-semibold text-center mt-[20px]">
              Project published
            </p>
            <p className="text-[16px] text-[#4D4D4D] font-normal text-center">
              Project post has been published.
            </p>

            <div className="w-full flex justify-center mt-[24px] ">
              <button
                className="px-[14px] py-[8px] gap-[13px] flex justify-center
               items-center rounded-[8px] border
                border-[#E4E7EC] bg-[#F9FAFB]"
              >
                <span
                  onClick={() => {
                    route.push('/project');
                    setIsUpLoad(false);
                  }}
                >
                  Go project page
                </span>
                <img src="/assets/create-project/right.svg" alt="rightIcon" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Processing;
