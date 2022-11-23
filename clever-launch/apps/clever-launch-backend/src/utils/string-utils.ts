export const isValidTransactionHash = (input: string): boolean => {
  const regexp = new RegExp('^0x([A-Fa-f0-9]{64})$');
  return regexp.test(input);
};
