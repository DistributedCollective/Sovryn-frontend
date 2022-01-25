import { useEffect, useState, useMemo } from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Asset, Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { fixNumber } from 'utils/helpers';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

const FEES = [
  {
    asset: Asset.RBTC,
    contract: getContract('RBTC_lending').address,
    value: '0',
    rbtcValue: '',
  },
  {
    asset: Asset.SOV,
    contract: getContract('SOV_token').address,
    value: '0',
    rbtcValue: '',
  },
  {
    asset: Asset.MYNT,
    contract: getContract('MYNT_token').address,
    value: '0',
    rbtcValue: '',
  },
];

type IAccumulatedFeesData = {
  [key in Asset]: string;
};

export interface IEarnedFee {
  asset: Asset;
  contract: string;
  value: string;
  rbtcValue: string;
}

export const useGetFeesEarnedClaimAmount = () => {
  const { assetRates, assetRatesLoading, assetRatesLoaded } = useSelector(
    selectWalletProvider,
  );

  const { loading, earnedFees } = useGetFeesEarned();

  const calculatedFees = useMemo(
    () =>
      earnedFees.map(fee => {
        const item = assetRates.find(
          item => item.source === fee.asset && item.target === Asset.RBTC,
        );
        const rate = item ? fixNumber(item.value.rate) : '0';
        const token = AssetsDictionary.get(fee.asset);

        const rbtcValue =
          fee.asset === Asset.RBTC
            ? bignumber(fee.value).toFixed(0)
            : bignumber(fee.value)
                .mul(rate)
                .div(10 ** token.decimals)
                .toFixed(0);

        return {
          ...fee,
          rbtcValue,
        };
      }),

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

export const useGetFeesEarned = () => {
  const address = useAccount();
  const [loading, setLoading] = useState(false);
  const [earnedFees, setEarnedFees] = useState<IEarnedFee[]>(FEES);
  const feeSharingProxyContract = getContract('feeSharingProxy');

  useEffect(() => {
    const getFees = () => {
      const callData = earnedFees.map(fee => ({
        address: feeSharingProxyContract.address,
        abi: feeSharingProxyContract.abi,
        fnName: 'getAccumulatedFees',
        args: [address, fee.contract],
        key: fee.asset,
        parser: value => value[0].toString(),
      }));

      setLoading(true);
      bridgeNetwork
        .multiCall<IAccumulatedFeesData>(Chain.RSK, callData)
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
    };
    if (address) {
      getFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    loading,
    earnedFees,
  };
};
