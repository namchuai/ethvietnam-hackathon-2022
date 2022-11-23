import React from 'react';
import { Player, Video, DefaultUi, Youtube } from '@vime/react';
import '@vime/core/themes/default.css';

interface IAppPlayerVideo {
  url: string;
  type: string;
}

// @ts-ignore
const AppPlayerVideo = ({ url, type }: IAppPlayerVideo) => {
  console.log(url, type);
  return (
    <Player playsinline>
      {type === 'youtube' ? (
        <iframe
          width={'100%'}
          height="219px"
          src={url.replace('watch?v=', 'embed/')}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <Video poster="https://media.vimejs.com/poster.png">
          <source data-src={url} type="video/mp4" />
        </Video>
      )}

      <DefaultUi />
    </Player>
  );
};

AppPlayerVideo.defaultProps = {
  type: 'youtube',
};

export default AppPlayerVideo;
