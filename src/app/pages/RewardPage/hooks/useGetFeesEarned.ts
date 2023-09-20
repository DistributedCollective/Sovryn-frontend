import { useEffect, useState } from 'react';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { IEarnedFee } from './useGetFeesEarnedClaimAmount';
import { BigNumber } from 'ethers';

const MAX_CHECKPONTS = 50;

const ASSETS = [Asset.RBTC, Asset.SOV, Asset.MYNT, Asset.ZUSD];

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
  const result = await Promise.all(
    ASSETS.map(asset =>
      asset === Asset.RBTC
        ? getRbtcDummyAddress()
        : getTokenContract(asset).address,
    ),
  );
  return result;
};

const getProcessedCheckpoints = (token: string, owner: string) =>
  contractReader
    .call<string>('feeSharingProxy', 'processedCheckpoints', [owner, token])
    .then(Number);

const getAllUserFeesPerMaxCheckpoints = (
  token: string,
  owner: string,
  from: number,
  max: number,
) =>
  contractReader
    .call<BigNumber[]>('feeSharingProxy', 'getAllUserFeesPerMaxCheckpoints', [
      owner,
      token,
      from,
      max,
    ])
    .then(result =>
      result.reduce((prev, cur) => prev.add(cur), BigNumber.from(0)),
    )
    .then(result => result.toString());

export const useGetFeesEarned = (): {
  loading: boolean;
  earnedFees: IEarnedFee[];
} => {
  const address = useAccount();
  const blockSync = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [earnedFees, setEarnedFees] = useState<IEarnedFee[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!address) {
        setLoading(false);
        setEarnedFees([]);
        return;
      }

      setLoading(true);
      const tokens = await getTokenAddresses();

      const checkpoints = await Promise.all(
        tokens.map(contractAddress =>
          getProcessedCheckpoints(contractAddress, address),
        ),
      );

      const results = await Promise.all(
        tokens.map((token, index) =>
          getAllUserFeesPerMaxCheckpoints(
            token,
            address,
            Math.max(checkpoints[index], 0),
            MAX_CHECKPONTS,
          ).then(
            amount =>
              ({
                asset: ASSETS[index],
                contractAddress: token,
                value: amount,
                rbtcValue: 0,
              } as IEarnedFee),
          ),
        ),
      );

      setEarnedFees(results);
      setLoading(false);
    };

    run().catch(console.error);
  }, [address, blockSync]);

  return {
    loading,
    earnedFees,
  };
};
