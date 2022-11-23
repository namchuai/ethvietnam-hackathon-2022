import { checkLinkVideo } from './checkLinkVideo';

export function getUrlVideo(link) {
  const isYoutube = checkLinkVideo(link);
  return isYoutube
    ? link.match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/
      )[1]
    : link;
}
