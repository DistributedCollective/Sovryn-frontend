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
  });
