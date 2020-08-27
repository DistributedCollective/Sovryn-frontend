/**
 *
 * LendingHistoryContainer
 *
 */

import React, { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { useAccount } from '../../hooks/useAccount';
import { useDrizzle } from '../../hooks/useDrizzle';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { useGetPastEvents } from '../../hooks/useGetPastEvents';
import { useGetActiveLoans } from '../../hooks/trading/useGetActiveLoans';

interface Props {
  asset: Asset;
}

export function LendingHistory(props: Props) {
  const account = useAccount();

  // const items = useGetPastEvents(getLendingContractName(props.asset), 'Mint', { filter: { to: account }, fromBlock: 0, toBlock: 'latest' });

  const { value, error } = useGetActiveLoans(account, 0, 100000, 0, false, false);

  // useEffect(() => {
  //   console.log(value, error);
  // }, [value, error]);
  // //
  // console.log(items);

  return (
    <>
      <div className="mt-4 row border-top">
        <div className="col-12">History</div>
        <div className="col-12">History</div>
      </div>
    </>
  );
}
