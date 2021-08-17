import { useCallback, useEffect, useRef, useState } from 'react';
import { Contract } from 'web3-eth-contract';
import { getWeb3Contract } from 'utils/blockchain/contract-helpers';
import { appContracts } from '../../../utils/blockchain/app-contracts';

export interface ActiveLoan {
  collateral: string;
  collateralToken: string;
  currentMargin: string;
  endTimestamp: string;
  interestDepositRemaining: string;
  interestOwedPerDay: string;
  loanId: string;
  loanToken: string;
  maintenanceMargin: string;
  maxLiquidatable: string;
  maxLoanTerm: string;
  maxSeizable: string;
  principal: string;
  startMargin: string;
  startRate: string;
}

export function useGetLoan() {
  const web3ContractRef = useRef<Contract>(null);
  const [value, setValue] = useState<ActiveLoan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    web3ContractRef.current = getWeb3Contract(
      appContracts.sovrynProtocol.address,
      appContracts.sovrynProtocol.abi,
    );
  }, []);

  const fetch = useCallback(loanId => {
    setLoading(true);
    web3ContractRef?.current?.methods
      .getLoan(loanId)
      .call()
      .then(data => {
        setValue(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        setError(e);
      });
  }, []);

  return { value, getLoan: fetch, loading, error };
}
