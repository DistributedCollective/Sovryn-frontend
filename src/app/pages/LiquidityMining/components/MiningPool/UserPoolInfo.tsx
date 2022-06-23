import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount } from '../../../../hooks/useAccount';
import { getTokenContractName } from '../../../../../utils/blockchain/contract-helpers';
import { LiquidityMiningRowTable } from '../RowTable';
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

  const { assetA, assetB, poolTokenA, poolTokenB } = pool;

  const [balance1, setBalance1] = useState('0');
  const [loading1, setLoading1] = useState(false);
  const [balance2, setBalance2] = useState('0');
  const [loading2, setLoading2] = useState(false);

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
      retrieveV2Balance(poolTokenA, () => {})
        .then(e => {
          setBalance1(e);
          setLoading1(false);
        })
        .catch(console.error);
      retrieveV2Balance(poolTokenB, () => {})
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
    />
  );
};
