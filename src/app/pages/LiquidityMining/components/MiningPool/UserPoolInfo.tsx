import React, { useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount } from '../../../../hooks/useAccount';
import { getTokenContractName } from '../../../../../utils/blockchain/contract-helpers';
import { LiquidityMiningRowTable } from '../RowTable';
import { useUserPoolData } from '../../hooks/useUserPoolData';
import { Asset } from '../../../../../types';
import { useCachedAssetRate } from '../../../../hooks/trading/useCachedAssetPrice';
import { useLiquidityMining_getUserAccumulatedReward } from '../../hooks/useLiquidityMining_getUserAccumulatedReward';
import { Balance, UserInfo } from './types';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

import erc20Abi from 'utils/blockchain/abi/erc20.json';

interface IUserPoolInfoProps {
  pool: AmmLiquidityPool;
  onNonEmptyBalance: () => void;
  successfulTransactions: number;
}

// todo this needs refactoring to optimize blockchain reads, most of the
//  calls to the node are also used in some of the child components
export const UserPoolInfo: React.FC<IUserPoolInfoProps> = ({
  pool,
  onNonEmptyBalance,
  successfulTransactions,
}) => {
  const account = useAccount();
  const { value: poolData, loading: plnLoading } = useUserPoolData(pool);

  const { assetA, assetB, poolTokenA, poolTokenB } = pool;

  const { value: rate1 } = useCachedAssetRate(assetA, Asset.RBTC);
  const { value: rate2 } = useCachedAssetRate(assetB, Asset.RBTC);
  const { value: sovRate } = useCachedAssetRate(Asset.SOV, Asset.RBTC);

  const [balance1, setBalance1] = useState('0');
  const [loading1, setLoading1] = useState(false);
  const [balance2, setBalance2] = useState('0');
  const [loading2, setLoading2] = useState(false);
  const [infoReward1, setInfoReward1] = useState('0');
  const [infoReward2, setInfoReward2] = useState('0');

  const { value: reward1 } = useLiquidityMining_getUserAccumulatedReward(
    poolTokenA,
  );

  const { value: reward2 } = useLiquidityMining_getUserAccumulatedReward(
    poolTokenB as string,
  );

  const rewardI1 = useMemo(
    () => bignumber(reward1).add(infoReward1).toFixed(0),
    [reward1, infoReward1],
  );

  const rewardI2 = useMemo(
    () => bignumber(reward2).add(infoReward2).toFixed(0),
    [reward2, infoReward2],
  );

  useEffect(() => {
    if (!account) return;
    const getInfo = async (token: string) => {
      const info = await contractReader.call<UserInfo>(
        'liquidityMiningProxy',
        'getUserInfo',
        [token, account],
      );

      return {
        amount: info ? info.amount : '0',
        reward: info ? info.accumulatedReward : '0',
      };
    };

    const getBalance = async (token: string, amount: string) => {
      const {
        0: balance,
        // 1: fee,
      } = await contractReader.callByAddress<Balance>(
        pool.converter,
        pool.converterAbi,
        'removeLiquidityReturnAndFee',
        [token, amount],
      );

      return balance;
    };

    const retrieveV2Balance = async (
      token: string,
      setReward: (value: string) => void,
    ) => {
      const info = await getInfo(token);
      setReward(info.reward);
      return await getBalance(token, info.amount);
    };

    const retrieveV1Balance = async () => {
      const info = await getInfo(poolTokenA);
      setInfoReward1(info.reward);
      const supply = await contractReader.callByAddress<string>(
        poolTokenA,
        erc20Abi,
        'totalSupply',
        [],
      );

      const converterBalance1 = await contractReader.call<string>(
        getTokenContractName(assetA),
        'balanceOf',
        [pool.converter],
      );

      const converterBalance2 = await contractReader.call<string>(
        getTokenContractName(assetB),
        'balanceOf',
        [pool.converter],
      );

      const balance1 = bignumber(info.amount)
        .div(supply)
        .mul(converterBalance1)
        .toFixed(0);
      const balance2 = bignumber(info.amount)
        .div(supply)
        .mul(converterBalance2)
        .toFixed(0);

      return {
        balance1,
        balance2,
      };
    };

    if (pool.converterVersion === 2 && poolTokenB) {
      setLoading1(true);
      setLoading2(true);
      retrieveV2Balance(poolTokenA, setInfoReward1)
        .then(e => {
          setBalance1(e);
          setLoading1(false);
        })
        .catch(console.error);
      retrieveV2Balance(poolTokenB, setInfoReward2)
        .then(e => {
          setBalance2(e);
          setLoading2(false);
        })
        .catch(console.error);
    } else {
      setLoading1(true);
      setLoading2(true);
      retrieveV1Balance()
        .then(e => {
          setBalance1(e.balance1);
          setBalance2(e.balance2);
          setLoading1(false);
          setLoading2(false);
        })
        .catch(console.error);
    }
  }, [
    account,
    pool,
    assetA,
    assetB,
    poolTokenA,
    poolTokenB,
    successfulTransactions,
  ]);

  const pln = useMemo(() => {
    const pl1 = poolData.data.find(item => item.asset === assetA);
    const pl2 = poolData.data.find(item => item.asset === assetB);
    let pln1 = '0';
    let pln2 = '0';

    if (pl1?.totalAdded && pl1?.totalAdded !== '0') {
      pln1 = bignumber(pl1?.removedMinusAdded || '0')
        .add(balance1)
        .toFixed(0);
    }

    if (pl2?.totalAdded && pl2?.totalAdded !== '0') {
      pln2 = bignumber(pl2?.removedMinusAdded || '0')
        .add(balance2)
        .toFixed(0);
    }

    return {
      pl1: pln1,
      pl2: pln2,
    };
  }, [poolData, assetA, assetB, balance1, balance2]);

  const totalEarned = useMemo(() => {
    const p1 = bignumber(pln.pl1).mul(rate1.rate).div(rate1.precision);
    const p2 = bignumber(pln.pl2).mul(rate2.rate).div(rate2.precision);
    const r1 = bignumber(rewardI1).mul(sovRate.rate).div(sovRate.precision);
    const r2 =
      pool.converterVersion === 1
        ? '0'
        : bignumber(rewardI2).mul(sovRate.rate).div(sovRate.precision);

    const result = p1.add(p2).add(r1).add(r2).toFixed(0);

    return isNaN(Number(result)) ? '0' : result;
  }, [
    pln.pl1,
    pln.pl2,
    rate1.rate,
    rate1.precision,
    rate2.rate,
    rate2.precision,
    rewardI1,
    sovRate.rate,
    sovRate.precision,
    pool.converterVersion,
    rewardI2,
  ]);

  useEffect(() => {
    if (balance1 !== '0' || balance2 !== '0') {
      onNonEmptyBalance();
    }
  }, [balance1, balance2, onNonEmptyBalance]);

  return (
    <LiquidityMiningRowTable
      pool={pool}
      balance1={balance1}
      loading1={loading1}
      balance2={balance2}
      loading2={loading2}
      asset1={assetA}
      asset2={assetB}
      pln1={pln.pl1}
      pln2={pln.pl2}
      plnLoading={plnLoading}
      totalEarned={totalEarned}
    />
  );
};
