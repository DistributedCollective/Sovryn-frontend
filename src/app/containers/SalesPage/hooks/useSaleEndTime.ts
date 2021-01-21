import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { currentNetwork } from '../../../../utils/classifiers';

// 12.30 GTM, 15th Jan
const DATE_FORMAT = 'HH:mm [GMT], Do MMM';

export function useSaleEndTime() {
  const [endDate, setEndDate] = useState(
    moment(
      currentNetwork === 'testnet'
        ? '2021-01-15 15:30+0'
        : '2021-01-21 15:30+0',
    )
      .utc(false)
      .toDate(),
  );
  const [endDateString, setEndDateString] = useState(
    moment(endDate).format(DATE_FORMAT),
  );

  const { value: endTime, loading } = useCacheCallWithValue(
    'CrowdSale',
    'end',
    '0',
  );

  useEffect(() => {
    if (endTime !== '0') {
      const mm = moment(Number(endTime) * 1e3).utc();
      setEndDate(mm.toDate());
      setEndDateString(mm.format(DATE_FORMAT));
    } else {
      setEndDate(null as any);
      setEndDateString('-');
    }
  }, [endTime]);

  return {
    now: moment().utc().toDate(),
    date: endDate,
    dateString: endDateString,
    loading,
  };
}
