import React, { useEffect } from 'react';
import {
  useGetTraderEvents,
  Event,
} from '../../hooks/graphql/useGetTraderEvents';
export const TestHistory = () => {
  const {
    loading: eventLoading,
    error: eventError,
    data: eventData,
  } = useGetTraderEvents([Event.TRADE, Event.TOKENS_DEPOSITED], '');

  useEffect(() => {
    console.log(eventLoading);
    console.log(eventData);
    console.log(eventError);
  }, [eventLoading, eventError, eventData]);

  return (
    <div>
      <h1>Testing Event History</h1>
    </div>
  );
};
