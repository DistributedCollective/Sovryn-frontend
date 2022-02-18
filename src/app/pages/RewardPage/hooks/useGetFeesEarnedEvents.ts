import { calculateAssetValue } from './../../../../utils/helpers';
import { useMemo } from 'react';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { bignumber } from 'mathjs';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';

export const useGetFeesEarnedEvents = () => {
  const { assetRates, assetRatesLoading, assetRatesLoaded } = useSelector(
    selectWalletProvider,
  );

  const { events, loading } = useGetContractPastEvents(
    'feeSharingProxy',
    'UserFeeWithdrawn',
  );

  const feesEarnedEvents = useMemo(
    () =>
      events.map(({ returnValues }) => {
        const asset = getFeesEarnedAsset(returnValues.token);
        const rbtcValue = calculateAssetValue(
          asset,
          returnValues.amount,
          Asset.RBTC,
          assetRates,
        );
        return {
          ...returnValues,
          rbtcValue,
        };
      }),

    [events, assetRates],
  );

  const totalAmount = useMemo(
    () =>
      feesEarnedEvents.reduce(
        (prevValue, curValue) => prevValue.add(curValue.rbtcValue),
        bignumber(0),
      ),
    [feesEarnedEvents],
  );

  return {
    loading: loading || (assetRatesLoading && !assetRatesLoaded),
    events: feesEarnedEvents,
    totalAmount,
  };
};

export const getFeesEarnedAsset = token =>
  assetByTokenAddress(token || '') || Asset.RBTC;
