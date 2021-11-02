import React, { useEffect } from 'react';
import {
  useGetCandles,
  CandleDuration,
} from '../../hooks/graphql/useGetChartCandles';

export const TestCandles = () => {
  const {
    loading: candleLoading,
    error: candleError,
    returnData: candleData,
  } = useGetCandles(
    CandleDuration.M_15,
    '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d',
    1635618840,
  );

  useEffect(() => {
    console.log('GETTING CANDLES');
    console.log(candleLoading);
    console.log(candleData);
    console.log(candleError);
  }, [candleLoading, candleError, candleData]);

  return (
    <div>
      <h1>Testing Candles</h1>
    </div>
  );
};
