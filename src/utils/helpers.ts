export const isObjectEmpty = (obj: {}) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const booleafy = (value: boolean) => (value ? 1 : 0);

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};
