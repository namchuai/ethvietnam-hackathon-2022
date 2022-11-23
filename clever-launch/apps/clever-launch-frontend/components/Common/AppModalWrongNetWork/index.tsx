import { Modal, Row, Text } from '@nextui-org/react';
import { AppState } from 'apps/clever-launch-frontend/store';
import { hideModalErrorNetWork } from 'apps/clever-launch-frontend/store/slices/errorNetWorkSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../AppButton';

const ModalWrongNetwork = () => {
  const dispatch = useDispatch();
  const { isShowError } = useSelector(
    (state: AppState) => state.errorNetworkSlice
  );

  const handleChangeNetWork = async () => {
    if (!window) return;
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x5',
          },
        ],
      });
      dispatch(hideModalErrorNetWork());
    } catch (error) {
      if ((error as any).code === 4001) {
        // RMessage.error('You declined the action in your wallet');
        return;
      }

      if ((error as any).code === 4902) {
        // addNetwork();
      }
    }
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      open={isShowError}
      onClose={() => dispatch(hideModalErrorNetWork())}
    >
      <Row
        justify="space-between"
        align={'center'}
        style={{
          borderBottom: '1px solid #80808063',
          padding: '10px 24px 15px 24px',
        }}
      >
        <Text size={16}>Wrong Network</Text>
        <img
          onClick={() => dispatch(hideModalErrorNetWork())}
          src={'/assets/images/close.svg'}
        />
      </Row>

      <Modal.Body>
        <Text size={14}>
          In order to perform the transactions, please switch to Ethereum
          network.
        </Text>

        <AppButton
          bgCustom={'#E8AA42'}
          css={{ width: '100%' }}
          onClick={() => handleChangeNetWork()}
        >
          Change network
        </AppButton>

        <AppButton
          bgCustom={'#E8AA42'}
          css={{ width: '100%' }}
          onClick={() => dispatch(hideModalErrorNetWork())}
        >
          Cancel
        </AppButton>
      </Modal.Body>
    </Modal>
  );
};

export default ModalWrongNetwork;
