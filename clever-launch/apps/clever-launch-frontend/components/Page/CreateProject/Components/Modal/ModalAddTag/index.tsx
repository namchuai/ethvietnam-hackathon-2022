import BasicModal from '../../../../../Common/BacsicModal';

declare type ModalConnectProps = {
  visible: boolean;
  closeHandler: any;
  listTag: Array<any>;
  title: string;
  setListTagSelected?: any;
  idTagArr: Array<any>;
  setIdTagArr?: any;
  handleApply?: any;
  limit?: number;
  isLimit?: boolean;
  setValue?: any;
};

function ModalAddTag(props: ModalConnectProps): JSX.Element {
  const {
    visible,
    closeHandler,
    listTag,
    title,
    limit,
    isLimit,
    idTagArr,
    setIdTagArr,
    handleApply,
  } = props;

  return (
    <BasicModal
      title={title}
      visible={visible}
      closeHandler={closeHandler}
      width="756px"
    >
      <div className="pr-6 pl-6 pb-6 pt-4">
        <div className={'flex flex-wrap gap-2'}>
          {listTag.map((item: any, index: number) => {
            return (
              <button
                key={index}
                className={`py-[10px] px-[16px]

              font-normal text-[#344054] text-[14px]

              border border-[#E4E7EC] rounded-[8px]

              flex items-center gap-[13px]

              ${Array.from(idTagArr).includes(item.id) && 'bg-[#E4E7EC]'}
              `}
                onClick={() => setIdTagArr([...idTagArr, item.id])}
                disabled={
                  isLimit &&
                  (Array.from(idTagArr).includes(item.id) ||
                    Array.from(idTagArr).length == limit)
                }
              >
                {!Array.from(idTagArr).includes(item.id) && (
                  <img src="/assets/create-project/plus-icon.svg" alt="" />
                )}
                {item.title}
              </button>
            );
          })}
        </div>

        {isLimit && (
          <div className="flex justify-start mt-[22px] mb-[10px] font-normal text-[#B4B4B4] text-[16px]">
            You can add a maximum up to 2 tags to your project
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="rounded-8px bg-[#E8AA42]
           py-[10px] px-[18px] font-normal text-[#212121]
            text-[16px] rounded-[8px] "
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </BasicModal>
  );
}

ModalAddTag.defaultProps = {
  limit: 2,
  isLimit: true,
};
export default ModalAddTag;
