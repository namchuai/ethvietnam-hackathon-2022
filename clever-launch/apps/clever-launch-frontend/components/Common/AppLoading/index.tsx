import React from 'react';
import styled from 'styled-components';
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

function AppLoading() {
  return (
    <div className="w-full min-w-[48px] flex justify-center">
      <SpinnerContainer className="h-[48px] w-[48px] flex rounded-[50%] bg-[#212121] justify-center items-center ">
        <img src="/assets/icon/processing.svg" alt="processingIcon" />
      </SpinnerContainer>
    </div>
  );
}
export default AppLoading;
