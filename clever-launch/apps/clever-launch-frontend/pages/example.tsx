import { Button, Typography } from '../components/Base';
import ModalSubscriber from '../components/Common/AppModalSubscriber';
import { Input, Dropdown } from '@nextui-org/react';
import ModalAddTag from '../components/Common/AppModalAddTag';
import AppButton from '../components/Common/AppButton';

const menuItems = [
  { key: 'new', name: 'New File' },
  { key: 'copy', name: 'Copy Link' },
  { key: 'edit', name: 'Edit File' },
  { key: 'delete', name: 'Delete File' },
];

export function Example() {
  return (
    <div>
      <Button variant={'filled'} color={'green'}>
        Button
      </Button>

      <Button variant={'outlined'} color={'green'}>
        Button
      </Button>
      <Button variant={'gradient'} color={'green'}>
        Button
      </Button>
      <Button fullWidth={true} variant={'outlined'} color={'green'}>
        Button
      </Button>
      <Typography variant={'h1'}>ssdsd</Typography>
      <Typography variant={'h2'}>ssdsd</Typography>
      <Typography variant={'h3'}>ssdsd</Typography>
      <Typography variant={'h4'}>ssdsd</Typography>
      <Typography variant={'h5'}>ssdsd</Typography>
      <Typography variant={'h6'}>ssdsd</Typography>
      <ModalSubscriber />
      <Input
        clearable
        fullWidth={true}
        bordered
        color="default"
        placeholder="Search ..."
        contentLeft={<img src={'/assets/icon/search.svg'} />}
      />
      <Dropdown>
        <Dropdown.Button
          style={{
            backgroundColor: 'white',
            border: '1px solid #E4E7EC',
            color: 'black',
            width: '300px',
            justifyContent: 'space-between',
          }}
          flat
        >
          <span className={'flex items-center justify-center'}>
            <img className={'mr-4'} src={'/assets/icon/down-icon.svg'} />
            Newest first
          </span>
        </Dropdown.Button>
        <Dropdown.Menu aria-label="Dynamic Actions" items={menuItems}>
          {(item: any) => (
            <Dropdown.Item key={item.key}>{item.name}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      <ModalAddTag />
      <AppButton width={'300px'} textColor={`black`}>
        Connect Wallet
      </AppButton>
    </div>
  );
}

export default Example;
