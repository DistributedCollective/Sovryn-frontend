import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Asset, Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { calculateAssetValue } from 'utils/helpers';
import { bignumber } from 'mathjs';
export interface IEarnedFee {
  asset: Asset;
  contractAddress: string;
  value: string;
  rbtcValue: number;
}

export const useGetFeesEarnedClaimAmount = () => {
  const { assetRates, assetRatesLoading, assetRatesLoaded } = useSelector(
    selectWalletProvider,
  );

  const { loading, earnedFees } = useGetFeesEarned();

  const calculatedFees = useMemo(
    () =>
      earnedFees.map(fee => ({
        ...fee,
        rbtcValue: calculateAssetValue(
          fee.asset,
          fee.value,
          Asset.RBTC,
          assetRates,
        ),
      })),

    [earnedFees, assetRates],
  );

  const totalAmount = useMemo(
    () =>
      calculatedFees.reduce(
        (prevValue, curValue) => prevValue.add(curValue.rbtcValue),
        bignumber(0),
      ),
    [calculatedFees],
  );
  return {
    loading: loading || (assetRatesLoading && !assetRatesLoaded),
    earnedFees: calculatedFees,
    totalAmount,
  };
};

const defaultEarnedFees: IEarnedFee[] = [
  {
    asset: Asset.RBTC,
    contractAddress: getContract('RBTC_lending').address,
    value: '0',
    rbtcValue: 0,
  },
  {
    asset: Asset.SOV,
    contractAddress: getContract('SOV_token').address,
    value: '0',
    rbtcValue: 0,
  },
  {
    asset: Asset.MYNT,
    contractAddress: getContract('MYNT_token').address,
    value: '0',
    rbtcValue: 0,
  },
  {
    asset: Asset.ZUSD,
    contractAddress: getContract('ZUSD_token').address,
    value: '0',
    rbtcValue: 0,
  },
];

const useGetFeesEarned = () => {
  const address = useAccount();
  const blockSync = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [earnedFees, setEarnedFees] = useState(defaultEarnedFees);
  const feeSharingProxyContract = getContract('feeSharingProxy');

  const getAvailableFees = useCallback(() => {
    const callData = earnedFees.map(fee => ({
      address: feeSharingProxyContract.address,
      abi: feeSharingProxyContract.abi,
      fnName: 'getAccumulatedFees',
      args: [address, fee.contractAddress],
      key: fee.asset,
      parser: value => value[0].toString(),
    }));

    setLoading(true);
    bridgeNetwork
      .multiCall(Chain.RSK, callData)
      .then(result => {
        if (result.returnData) {
          const fees = earnedFees.map(fee => ({
            ...fee,
            value: result.returnData[fee.asset] || '',
          }));
          setEarnedFees(fees);
        }
      })
      .catch(error => {
        console.error('e', error);
      })
      .finally(() => setLoading(false));
  }, [
    address,
    earnedFees,
    feeSharingProxyContract.abi,
    feeSharingProxyContract.address,
  ]);

  useEffect(() => {
    if (address) {
      getAvailableFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, blockSync]);

  return {
    loading,
    earnedFees,
  };
};
