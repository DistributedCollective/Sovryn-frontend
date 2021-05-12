import React, { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import type {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from 'utils/models/liquidity-pool';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { PoolTokenRewards } from './PoolTokenRewards';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount } from '../../../../hooks/useAccount';
import {
  getAmmContract,
  getAmmContractName,
  getPoolTokenContractName,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';

interface Props {
  pool: LiquidityPool;
}

export function UserPoolInfo({ pool }: Props) {
  const account = useAccount();
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
    <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-8">
      <div>
        {/* Backend needed, parse events */}
        <div>APY%</div>
        <div>0</div>
      </div>
      <div>
        <div>Fee Share</div>
        <div>{toNumberFormat(pool.version === 1 ? 0.3 : 0.1, 1)}%</div>
      </div>
      <div className="tw-font-bold">
        <div>Your Liquidity</div>
        <div>
          <div>
            <LoadableValue
              loading={loading1}
              value={
                <>
                  {weiToNumberFormat(balance1, 4)}{' '}
                  <AssetRenderer asset={token1.asset} />
                </>
              }
            />
          </div>
          <div>
            <LoadableValue
              loading={loading2}
              value={
                <>
                  {weiToNumberFormat(balance2, 4)}{' '}
                  <AssetRenderer asset={token2.asset} />
                </>
              }
            />
          </div>
        </div>
      </div>
      <div className="tw-font-bold">
        {/* Backend needed, parse events */}
        <div>P/L</div>
        <div>0</div>
      </div>
      <div className="tw-font-bold">
        <div>Rewards</div>
        <div>
          <PoolTokenRewards pool={pool} />
        </div>
      </div>
    </div>
  );
}
