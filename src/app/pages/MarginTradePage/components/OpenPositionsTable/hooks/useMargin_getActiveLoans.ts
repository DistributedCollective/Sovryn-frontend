import { useEffect, useState } from 'react';
import { AppMode } from 'types';
import { useDebug } from 'app/hooks/useDebug';
import { ActiveLoan } from 'types/active-loan';
import { currentNetwork } from 'utils/classifiers';
import { booleafy } from 'utils/helpers';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useMargin_getActiveLoans = (owner: string) => {
  const { log, error } = useDebug('useMargin_getActiveLoans');

  const [items, setItems] = useState<ActiveLoan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (owner) {
      setLoading(true);
      contractReader
        .call<ActiveLoan[]>(
          'sovrynProtocol',
          // method available on testnet only until this PR is deployed to mainnet
          // https://github.com/DistributedCollective/Sovryn-smart-contracts/pull/412
          currentNetwork === AppMode.MAINNET
            ? 'getUserLoans'
            : 'getUserLoansV2',
          [owner, 0, 200, 1, booleafy(false), booleafy(false)],
        )
        .then(response => response.map(item => ({ ...item })))
        .then(response =>
          response.sort(
            (a, b) => Number(b.endTimestamp) - Number(a.endTimestamp),
          ),
        )
        .then(response => {
          log(response);
          setItems(response);
        })
        .catch(err => {
          error(err);
          setItems([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [error, log, owner]);

  return {
    items,
    loading,
  };
};
