import moment from 'moment';

export const getNextMonday = () =>
  moment().utc().startOf('week').add(1, 'week').day('monday').format('MMMM Do');
