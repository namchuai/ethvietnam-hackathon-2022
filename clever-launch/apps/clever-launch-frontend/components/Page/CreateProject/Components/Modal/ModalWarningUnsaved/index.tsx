import { Modal } from '@nextui-org/react';
import { useRouter } from 'next/router';

const ModalWarningUnsaved = ({ visible, closeHandler, projectId, tabId }) => {
  const route = useRouter();

  const handleRouter = (tabId) => {
    closeHandler();
    route.push({
      pathname: '/create-project/[id]',
      query: { id: `${projectId}`, tab: tabId },
    });
  };
  return (
    <Modal open={visible} onClose={closeHandler}>
      <Modal.Body>
        <div>
          <img src="/assets/create-project/warnning.svg" />
        </div>
        <div className="text-[#101828] text-[16px]">
          You have unsaved changes
        </div>

        <p className="text-[14px] text-[#667085] mt-[8px] mb-[32px]">
          You have unsaved changes, do you want to to continue?
        </p>

        <div className="flex w-full justify-between gap-[12px]">
          <button
            className="rounded-[8px] text-[#344054] w-full bg-[#E8AA42]
          text-[16px] py-[8px] px-[10px]"
            onClick={closeHandler}
          >
            No, cancel
          </button>
          <button
            className="rounded-[8px] py-[8px]
          px-[10px] w-full border
          border-[#E4E7EC]"
            onClick={() => handleRouter(tabId)}
          >
            Yes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalWarningUnsaved;
