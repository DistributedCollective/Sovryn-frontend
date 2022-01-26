import { useMemo } from 'react';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { fixNumber } from 'utils/helpers';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';

export const useGetFeesEarnedEvents = () => {
  const { assetRates, assetRatesLoading, assetRatesLoaded } = useSelector(
    selectWalletProvider,
  );

  const { events } = useGetContractPastEvents(
    'feeSharingProxy',
    'UserFeeWithdrawn',
  );

  const feesEarnedEvents = useMemo(
    () =>
      events.map(({ returnValues }) => {
        const asset = getFeesEarnedAsset(returnValues.token);
        const assetDetails = AssetsDictionary.get(asset);
        const item = assetRates.find(
          item => item.source === asset && item.target === Asset.RBTC,
        );
        const rate = item ? fixNumber(item.value.rate) : '0';

        const rbtcValue =
          asset === Asset.RBTC
            ? bignumber(returnValues.amount).toFixed(0)
            : bignumber(returnValues.amount)
                .mul(rate)
                .div(10 ** assetDetails.decimals)
                .toFixed(0);

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
    loading: assetRatesLoading && !assetRatesLoaded,
    events: feesEarnedEvents,
    totalAmount,
  };
};

export const getFeesEarnedAsset = token =>
  assetByTokenAddress(token || '') || Asset.RBTC;
