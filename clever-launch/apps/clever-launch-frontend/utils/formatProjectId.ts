export const formatProjectId = (address: string) => {
  return `0x` + `${address?.split('-').join('')}`;
};
