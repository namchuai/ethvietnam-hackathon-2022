import { Modal } from '@nextui-org/react';
import { AppState } from 'apps/clever-launch-frontend/store';
import { hideModalTx } from 'apps/clever-launch-frontend/store/slices/modalWaitingTx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const ModalWaitingTransaction = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isShow, title } = useSelector(
    (state: AppState) => state.modalTxSlice
  );

  return (
    <Modal
      open={isShow}
      onClose={() => dispatch(hideModalTx())}
      preventClose={true}
    >
      <Modal.Body>
        <div className="text-center">{title}</div>
        <div className="w-full flex justify-center">
          <SpinnerContainer className="h-[48px] w-[48px] flex rounded-[50%] bg-[#212121] justify-center items-center ">
            <img
              src="/assets/create-project/processing.svg"
              alt="processingIcon"
            />
          </SpinnerContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalWaitingTransaction;
