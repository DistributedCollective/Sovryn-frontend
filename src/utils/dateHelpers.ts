import moment from 'moment';

export const getNextMonday = () =>
  moment().startOf('week').add(1, 'week').day('monday').format('MMMM Do');
