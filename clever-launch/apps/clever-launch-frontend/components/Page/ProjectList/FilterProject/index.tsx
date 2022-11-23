import React from 'react';
import { Dropdown, Grid, Input } from '@nextui-org/react';
import useMobile from '../../../../hooks/useMobile';
import ModalAddTag from '../../CreateProject/Components/Modal/ModalAddTag';
import AppInput from '../../../Common/AppInput';
const menuItems = [
  { key: 'newest_first', name: 'Newest first' },
  { key: 'oldest_first', name: 'Oldest first' },
];

interface IFilterProject {
  filter?: any;
  onChange?: void;
  sortType?: any;
  setSortType?: any;
  onSortChange?: void;
  sortOptions?: any;
  handleApply?: any;
  listTag?: any;
  isShow?: boolean;
  setListTagSelected?: any;
  idTagArr?: any;
  setIdTagArr?: any;
  setIsShow?: any;
  listTagSelected?: any;
  remove?: any;
}

function FilterProject({
  filter,
  onChange,
  onSortChange,
  sortOptions,
  listTag,
  isShow,
  setListTagSelected,
  idTagArr,
  handleApply,
  setIdTagArr,
  setIsShow,
  listTagSelected,
  remove,
  setSortType,
  sortType,
}: IFilterProject) {
  const isMobile = useMobile();
  return (
    <div>
      <div
        className={
          'flex gap-y-[8px] flex-col md:flex-row md:justify-between mb-4'
        }
      >
        {/*<AppInput*/}
        {/*  value={''}*/}
        {/*  defaultValue={''}*/}
        {/*  clearable*/}
        {/*  animated={false}*/}
        {/*  onChange={(e) => console.log(e.target.value)}*/}
        {/*  fullWidth={isMobile}*/}
        {/*  color="default"*/}
        {/*  placeholder="Search ..."*/}
        {/*  contentLeft={<img src={'/assets/icon/search.svg'} />}*/}
        {/*/>*/}
        <Dropdown>
          <Dropdown.Button
            style={{
              backgroundColor: 'white',
              border: '1px solid #E4E7EC',
              color: 'black',
              width: `${isMobile ? '100%' : '300px'}`,
              justifyContent: 'space-between',
            }}
            flat
          >
            <span className={'flex items-center justify-center'}>
              <img className={'mr-4'} src={'/assets/icon/down-icon.svg'} />
              {action[sortType]}
            </span>
          </Dropdown.Button>
          <Dropdown.Menu
            defaultValue={sortType}
            aria-label="Dynamic Actions"
            items={menuItems}
            selectionMode="single"
            selectedKeys={sortType}
            onSelectionChange={(event: any) => setSortType(event?.currentKey)}
          >
            {(item: any) => (
              <Dropdown.Item key={item.key}>{item.name}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

const action = {
  newest_first: 'Newest first',
  oldest_first: 'Oldest first',
};

export default FilterProject;
