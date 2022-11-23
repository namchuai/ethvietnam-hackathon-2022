import { Modal } from '@nextui-org/react';

declare type BacsicModalProps = {
  title: string;
  visible: boolean;
  closeHandler: any;
  children: any;
  width?: string;
};

function BasicModal(props: BacsicModalProps): JSX.Element {
  const { title, visible, closeHandler, children, width } = props;
  return (
    <Modal open={visible} onClose={closeHandler} width={width}>
      <div className="mt-3 mb-3 flex items-center justify-between pr-6 pl-6 text-[16px] font-normal text-[#212121]">
        {title}
        <img src="/assets/icon/x.svg" alt="x-icon" onClick={closeHandler} />
      </div>
      <div className="border-b" />
      <div>{children}</div>
    </Modal>
  );
}

export default BasicModal;
