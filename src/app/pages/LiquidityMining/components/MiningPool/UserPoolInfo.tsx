import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import type {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from 'utils/models/liquidity-pool';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount } from '../../../../hooks/useAccount';
import {
  getAmmContract,
  getAmmContractName,
  getPoolTokenContractName,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';
import { LiquidityMiningRowTable } from '../RowTable';
import { useUserPoolData } from '../../hooks/useUserPoolData';

interface Props {
  pool: LiquidityPool;
}

export function UserPoolInfo({ pool }: Props) {
  const account = useAccount();
  const data = useUserPoolData(pool);

  console.log({ pool, data });

  const token1 = pool.supplyAssets[0];
  const token2 = pool.supplyAssets[1];

  const [balance1, setBalance1] = useState('0');
  const [loading1, setLoading1] = useState(false);
  const [balance2, setBalance2] = useState('0');
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    if (!account) return;
    const getInfo = async (token: LiquidityPoolSupplyAsset) => {
      const info = (await contractReader.call(
        'liquidityMiningProxy',
        'getUserInfo',
        [token.getContractAddress(), account],
      )) as any;
      return info ? info.amount : '0';
    };

    const getBalance = async (
      token: LiquidityPoolSupplyAsset,
      amount: string,
    ) => {
      const {
        0: balance,
        // 1: fee,
      } = await contractReader.call(
        getAmmContractName(pool.poolAsset),
        'removeLiquidityReturnAndFee',
        [token.getContractAddress(), amount],
      );
      return balance;
    };

    const retrieveV2Balance = async (token: LiquidityPoolSupplyAsset) => {
      const info = await getInfo(token);
      return await getBalance(token, info);
    };

    const retrieveV1Balance = async () => {
      const info = await getInfo(token1);
      const supply = (await contractReader.call(
        getPoolTokenContractName(pool.poolAsset, pool.poolAsset),
        'totalSupply',
        [],
      )) as any;
      const converterBalance1 = (await contractReader.call(
        getTokenContractName(token1.asset),
        'balanceOf',
        [getAmmContract(pool.poolAsset).address],
      )) as any;
      const converterBalance2 = (await contractReader.call(
        getTokenContractName(token2.asset),
        'balanceOf',
        [getAmmContract(pool.poolAsset).address],
      )) as any;

      const balance1 = bignumber(info)
        .div(supply)
        .mul(converterBalance1)
        .toFixed(0);
      const balance2 = bignumber(info)
        .div(supply)
        .mul(converterBalance2)
        .toFixed(0);

      return {
        balance1,
        balance2,
      };
    };

    if (pool.version === 2) {
      setLoading1(true);
      setLoading2(true);
      retrieveV2Balance(token1)
        .then(e => {
          setBalance1(e);
          setLoading1(false);
        })
        .catch(console.error);
      retrieveV2Balance(token2)
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
  }, [account, pool, token1, token2]);

  return (
    <LiquidityMiningRowTable
      pool={pool}
      balance1={balance1}
      loading1={loading1}
      balance2={balance2}
      loading2={loading2}
      asset1={token1.asset}
      asset2={token2.asset}
      pln1="0"
      pln2="0"
      totalEarned="0"
    />
  );
}
