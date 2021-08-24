import dayjs from 'dayjs';

export const getNextMonday = () =>
  dayjs().utc().startOf('week').add(1, 'week').day(1).format('MMMM D');
