import { useEffect, useState } from 'react';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { Asset, Chain } from 'types';
import {
  assetByLoanTokenAddress,
  assetByTokenAddress,
  getContract,
  getLendingContract,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { IEarnedFee } from './useGetFeesEarnedClaimAmount';
import { BigNumber } from 'ethers';
import {
  MultiCallData,
  bridgeNetwork,
} from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useIsMounted } from 'app/hooks/useIsMounted';

const MAX_CHECKPOINTS = 50;

const TOKEN_ASSETS = [
  Asset.RBTC,
  Asset.WRBTC,
  Asset.SOV,
  Asset.MYNT,
  Asset.ZUSD,
];
const LOAN_ASSETS = [Asset.RBTC];

let btcDummyAddress: string;
const getRbtcDummyAddress = async () => {
  if (!btcDummyAddress) {
    btcDummyAddress = await contractReader.call<string>(
      'feeSharingProxy',
      'RBTC_DUMMY_ADDRESS_FOR_CHECKPOINT',
      [],
    );
  }
  return btcDummyAddress;
};

const getTokenAddresses = async () => {
  const result = await Promise.all([
    ...TOKEN_ASSETS.map(asset =>
      asset === Asset.RBTC
        ? getRbtcDummyAddress()
        : getTokenContract(asset).address,
    ),
    ...LOAN_ASSETS.map(asset => getLendingContract(asset).address),
  ]);
  return result;
};

export const useGetFeesEarned = (): {
  loading: boolean;
  earnedFees: IEarnedFee[];
} => {
  const isMounted = useIsMounted();
  const address = useAccount();
  const blockSync = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [earnedFees, setEarnedFees] = useState<IEarnedFee[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!isMounted()) {
        return;
      }

      if (!address) {
        setLoading(false);
        setEarnedFees([]);
        return;
      }

      setLoading(true);

      const feeSharingProxy = getContract('feeSharingProxy');
      const tokens = await getTokenAddresses();

      const checkpoints = await bridgeNetwork.multiCall(
        Chain.RSK,
        tokens.flatMap(
          token =>
            [
              {
                address: feeSharingProxy.address,
                abi: feeSharingProxy.abi,
                fnName: 'totalTokenCheckpoints',
                args: [token],
                key: `${token}/totalTokenCheckpoints`,
                parser: (value: string) => Number(value),
              },
              {
                address: feeSharingProxy.address,
                abi: feeSharingProxy.abi,
                fnName: 'processedCheckpoints',
                args: [address, token],
                key: `${token}/processedCheckpoints`,
                parser: (value: string) => Number(value),
              },
            ] as MultiCallData[],
        ),
      );

      const amounts = await bridgeNetwork.multiCall(
        Chain.RSK,
        tokens.map(
          token =>
            ({
              address: feeSharingProxy.address,
              abi: feeSharingProxy.abi,
              fnName: 'getAllUserFeesPerMaxCheckpoints',
              args: [
                address,
                token,
                Math.max(
                  checkpoints.returnData[`${token}/processedCheckpoints`],
                  0,
                ),
                MAX_CHECKPOINTS,
              ],
              key: token,
              parser: ({ fees }: { fees: string[] }) =>
                fees.reduce((prev, cur) => prev.add(cur), BigNumber.from(0)),
            } as MultiCallData),
        ),
      );

      const results = tokens.map(
        token =>
          ({
            asset: assetByTokenAddress(token) || assetByLoanTokenAddress(token),
            contractAddress: token,
            value: amounts.returnData[token].toString(),
            rbtcValue: 0,
            startFrom: checkpoints.returnData[`${token}/processedCheckpoints`],
            maxCheckpoints:
              checkpoints.returnData[`${token}/totalTokenCheckpoints`],
          } as IEarnedFee),
      );

      if (isMounted()) {
        setEarnedFees(results);
        setLoading(false);
      }
    };

    run().catch(console.error);
  }, [address, blockSync, isMounted]);

  return {
    loading,
    earnedFees,
  };
};
