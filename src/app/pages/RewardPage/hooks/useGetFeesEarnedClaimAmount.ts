import { useMemo } from 'react';
import { Asset } from 'types';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { calculateAssetValue } from 'utils/helpers';
import { bignumber } from 'mathjs';
import { useGetFeesEarned } from './useGetFeesEarned';
export interface IEarnedFee {
  asset: Asset;
  contractAddress: string;
  value: string;
  rbtcValue: number;
  startFrom?: number;
  maxCheckpoints?: number;
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
