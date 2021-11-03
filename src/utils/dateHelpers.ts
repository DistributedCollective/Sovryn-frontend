import dayjs from 'dayjs';

export const getNextMonday = () =>
  dayjs().utc().startOf('week').add(1, 'week').day(1).format('MMMM D');

export const timestampToDateTimeString = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    timeZone: 'UTC',
  });

export const timestampToDateString = (timestamp: number) => {
  const date = parseInt(
    new Date(timestamp * 1000).toLocaleString('en-GB', {
      day: 'numeric',
      timeZone: 'UTC',
    }),
  );
  const month = new Date(timestamp * 1000).toLocaleString('en-GB', {
    month: 'short',
    timeZone: 'UTC',
  });
  const getDateOrdinalFormat = n =>
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '');
  return `${getDateOrdinalFormat(date)} ${month}`;
};
