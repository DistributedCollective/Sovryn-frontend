import React, { useEffect } from 'react';
import {
  useGetTraderEvents,
  Event,
} from '../../hooks/graphql/useGetTraderEvents';

export const TestHistory = () => {
  const { loading, error, data } = useGetTraderEvents(
    [Event.TRADE, Event.TOKENS_DEPOSITED],
    '',
  );

  useEffect(() => {
    console.log(loading);
    console.log(data);
    console.log(error);
  }, [loading, error, data]);

  return (
    <div>
      <h1>Testing Event History</h1>
    </div>
  );
};
