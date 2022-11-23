import React from 'react';
import { Avatar, Grid } from '@nextui-org/react';
import moment from 'moment';
import * as DOMPurify from 'dompurify';

interface IUpdateProjectItem {
  avatarUrl?: string;
  createdAt?: string;
  content?: any;
  projectUpdateNumber?: any;
  author?: string;
}

function UpdateProjectItem({
  avatarUrl,
  createdAt,
  content,
  projectUpdateNumber,
  author,
}: IUpdateProjectItem) {
  return (
    <Grid.Container gap={2} justify="flex-start">
      <Grid xs={12} md={8}>
        <div
          className={`w-full min-h-[200px] p-[40px] border border-[#E4E7EC]`}
        >
          <div className="w-full border-b flex gap-[22px] py-[24px] mb-[24px]">
            <div>
              <Avatar
                src={avatarUrl || '/assets/icon/avatar-default.svg'}
                css={{ size: '$20', zIndex: 1, cursor: 'pointer' }}
              />
            </div>
            <div className="w-full flex flex-col gap-[22px]">
              <p className="text-[#1F4690] text-[16px]">
                By {author ? author : 'NOG Studio'}
              </p>
              <div className="flex w-full justify-between text-[#4D4D4D] text-[16px]">
                <p>{moment(createdAt).format('DD-MM-YYYY')}</p>
                <p># Update {projectUpdateNumber}</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
          </div>
        </div>
      </Grid>
    </Grid.Container>
  );
}

export default UpdateProjectItem;
