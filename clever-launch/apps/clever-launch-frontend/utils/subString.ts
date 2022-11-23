export const shortenSting = (string: string) => {
  if (string.length > 20) {
    return `${string.substring(0, 20)}...`;
  }
  return string;
};
