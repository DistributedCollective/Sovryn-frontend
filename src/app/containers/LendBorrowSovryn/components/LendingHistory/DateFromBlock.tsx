import React, { useEffect, useState } from 'react';
import { Sovryn } from 'utils/sovryn';
import { LoadableValue } from 'app/components/LoadableValue';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';

interface Props {
  blockNumber: number;
}

export function DateFromBlock({ blockNumber }: Props) {
  const [state, setState] = useState({
    loading: true,
    timestamp: 0,
  });

  useEffect(() => {
    Sovryn.getWeb3()
      .eth.getBlock(blockNumber)
      .then(({ timestamp }) =>
        setState({ timestamp: timestamp as number, loading: false }),
      )
      .catch(console.error);
  }, [blockNumber]);

  return (
    <LoadableValue
      loading={state.loading}
      value={<DisplayDate timestamp={String(state.timestamp)} />}
    />
  );
}
