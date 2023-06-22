import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Asset, Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { IEarnedFee } from './useGetFeesEarnedClaimAmount';
import { useGetTokenCheckpoints } from './useGetTokenCheckpoints';

export const useGetFeesEarned = (): {
  loading: boolean;
  earnedFees: IEarnedFee[];
} => {
  const address = useAccount();
  const blockSync = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [RBTCDummyAddress, setRBTCDummyAddress] = useState(
    '0xeabd29be3c3187500df86a2613c6470e12f2d77d',
  );

  const contractAddresses = useMemo(
    () => ({
      [Asset.RBTC]: RBTCDummyAddress,
      [Asset.SOV]: getContract('SOV_token').address,
      [Asset.MYNT]: getContract('MYNT_token').address,
      [Asset.ZUSD]: getContract('ZUSD_token').address,
    }),
    [RBTCDummyAddress],
  );

  const {
    userCheckpoint: sovUserCheckpoint,
    maxWithdrawCheckpoint: sovMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(Asset.SOV);
  const {
    userCheckpoint: myntUserCheckpoint,
    maxWithdrawCheckpoint: myntMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(Asset.MYNT);
  const {
    userCheckpoint: zusdUserCheckpoint,
    maxWithdrawCheckpoint: zusdMaxWithdrawCheckpoint,
  } = useGetTokenCheckpoints(Asset.ZUSD);

  const getStartFrom = useCallback(
    (asset: Asset) => {
      switch (asset) {
        case Asset.SOV:
          return Number(sovUserCheckpoint?.checkpointNum) || 0;
        case Asset.MYNT:
          return Number(myntUserCheckpoint?.checkpointNum) || 0;
        case Asset.ZUSD:
          return Number(zusdUserCheckpoint?.checkpointNum) || 0;
        default:
          return 0;
      }
    },
    [sovUserCheckpoint, myntUserCheckpoint, zusdUserCheckpoint],
  );

  const getMaxCheckpoints = useCallback(
    (asset: Asset) => {
      switch (asset) {
        case Asset.SOV:
          return sovMaxWithdrawCheckpoint;
        case Asset.MYNT:
          return myntMaxWithdrawCheckpoint;
        case Asset.ZUSD:
          return zusdMaxWithdrawCheckpoint;
        default:
          return 0;
      }
    },
    [
      sovMaxWithdrawCheckpoint,
      myntMaxWithdrawCheckpoint,
      zusdMaxWithdrawCheckpoint,
    ],
  );

  const generateDefaultEarnedFees = useCallback(() => {
    return Object.entries(contractAddresses).map(
      ([asset, contractAddress]): IEarnedFee => ({
        asset: asset as Asset,
        contractAddress,
        value: '0',
        rbtcValue: 0,
        ...(asset !== Asset.RBTC ? { startFrom: 0, maxCheckpoints: 0 } : {}),
      }),
    );
  }, [contractAddresses]);

  const defaultEarnedFees: IEarnedFee[] = useMemo(generateDefaultEarnedFees, [
    contractAddresses,
    generateDefaultEarnedFees,
  ]);

  const [earnedFees, setEarnedFees] = useState(defaultEarnedFees);
  const feeSharingProxyContract = getContract('feeSharingProxy');

  const getAvailableFees = useCallback(() => {
    const callData = earnedFees.map(fee => {
      const isRBTC = fee.asset === Asset.RBTC;
      const fnName = isRBTC
        ? 'getAccumulatedRBTCFeeBalances'
        : 'getAccumulatedFeesForCheckpointsRange';
      const startFrom = Math.max(getStartFrom(fee.asset) - 1, 0);
      const args = isRBTC
        ? [address]
        : [
            address,
            fee.contractAddress,
            startFrom,
            getMaxCheckpoints(fee.asset),
          ];
      return {
        address: feeSharingProxyContract.address,
        abi: feeSharingProxyContract.abi,
        fnName,
        args,
        key: fee.asset,
        parser: value => value[0].toString(),
      };
    });

    if (
      !sovMaxWithdrawCheckpoint ||
      !zusdMaxWithdrawCheckpoint ||
      !myntMaxWithdrawCheckpoint
    ) {
      return;
    }

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
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error getting available fees:', error);
      })
      .finally(() => setLoading(false));
  }, [
    address,
    earnedFees,
    feeSharingProxyContract.abi,
    feeSharingProxyContract.address,
    getStartFrom,
    getMaxCheckpoints,
    sovMaxWithdrawCheckpoint,
    zusdMaxWithdrawCheckpoint,
    myntMaxWithdrawCheckpoint,
  ]);

  useEffect(() => {
    const getRbtcDummyAddress = async () => {
      try {
        const result = await contractReader.call<string>(
          'feeSharingProxy',
          'RBTC_DUMMY_ADDRESS_FOR_CHECKPOINT',
          [],
        );
        setRBTCDummyAddress(result);
      } catch (error) {
        console.error('Error getting RBTC dummy address:', error);
      }
    };

    getRbtcDummyAddress();
  }, []);

  useEffect(() => {
    if (address) {
      getAvailableFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, blockSync, getAvailableFees]);

  return {
    loading,
    earnedFees,
  };
};
