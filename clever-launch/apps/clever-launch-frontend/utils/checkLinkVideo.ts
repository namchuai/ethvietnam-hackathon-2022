export function checkLinkVideo(link) {
  const valid = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/;
  return valid.test(link);
}
