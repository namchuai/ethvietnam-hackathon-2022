import React, { useState } from 'react';
import { Button, Checkbox, Input, Modal, Row, Text } from '@nextui-org/react';
interface IModalAddTag {
  onChange?: void;
}

function ModalAddTag({ onChange }: IModalAddTag) {
  const [visible, setVisible] = React.useState(false);
  const [tags, setTag] = useState([
    {
      id: 1,
      name: 'Game',
    },
    {
      id: 2,
      name: 'Air',
    },
    {
      id: 2,
      name: 'Air',
    },
  ]);

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <div className={'flex'}>
      <Button
        auto
        style={{
          backgroundColor: '#E4E7EC',
          color: 'black',
          width: '56px',
          marginRight: '10px',
        }}
      >
        <span className={'flex justify-center'}>
          Game <img className={'ml-4'} src={'/assets/icon/close-tag.svg'} />
        </span>
      </Button>
      <Button
        auto
        style={{
          backgroundColor: '#E4E7EC',
          color: 'black',
          width: '56px',
          marginRight: '10px',
        }}
      >
        <span className={'flex justify-center'}>
          Game1 <img className={'ml-4'} src={'/assets/icon/close-tag.svg'} />
        </span>
      </Button>
      <Button
        auto
        onClick={handler}
        style={{
          backgroundColor: 'white',
          border: '1px solid #E4E7EC',
          color: 'black',
          width: '56px',
        }}
      >
        <span className={'flex justify-center'}>
          <img className={'mr-4'} src={'/assets/icon/add-tag.svg'} /> Add tag
        </span>
      </Button>
      <Modal
        closeButton={false}
        width="756px"
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
          <Text size={16}>Add Tag</Text>
          <img onClick={closeHandler} src={'/assets/images/close.svg'} />
        </Row>
        <Modal.Body>
          <div className={'mt-[20px]'} />
          <div className={'flex flex-wrap min-h-[300px]'}>
            {tags.map((item, index) => {
              return (
                <Button
                  key={index}
                  auto
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E4E7EC',
                    color: 'black',
                    minWidth: '56px',
                    marginRight: '10px',
                  }}
                >
                  <span className={'flex justify-center'}>
                    <img className={'mr-4'} src={'/assets/icon/add-tag.svg'} />{' '}
                    {item.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModalAddTag;
