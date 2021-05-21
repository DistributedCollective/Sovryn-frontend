import React, { useEffect, useState } from 'react';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount, useBlockSync } from '../../../../hooks/useAccount';
import ERC20Abi from 'utils/blockchain/abi/erc20.json';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../../../../../utils/models/liquidity-pool';
import { Asset } from '../../../../../types';
import { AmmPool } from './AmmPool';
import { PoolTransferDialog } from './PoolTransferDialog';
import { ActionButton } from 'app/components/Form/ActionButton';

import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

const pools = LiquidityPoolDictionary.list();

interface StateInterface {
  pool: Asset;
  asset: LiquidityPoolSupplyAsset;
  balance: string;
}

interface IAmmPoosBannerProps {
  onDataNotPresent: () => void;
}

export function AmmPoolsBanner({ onDataNotPresent }: IAmmPoosBannerProps) {
  const { t } = useTranslation();

  const account = useAccount();
  const synBlock = useBlockSync();

  const [transferDialog, setTransferDialog] = useState(false);
  const [state, setState] = useState<StateInterface[]>([]);

  useEffect(() => {
    const getBalance = async (
      pool: LiquidityPool,
      token: LiquidityPoolSupplyAsset,
    ) => {
      return await contractReader.callByAddress(
        token.getContractAddress(),
        ERC20Abi as any,
        'balanceOf',
        [account],
      );
    };

    const getData = async () => {
      const items: StateInterface[] = [];
      for (let pool of pools) {
        if (pool.version === 1) {
          const balance = (await getBalance(pool, pool.supplyAssets[0])) as any;
          if (balance !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[0],
              balance,
            });
          }
        } else if (pool.version === 2) {
          const balance1 = (await getBalance(
            pool,
            pool.supplyAssets[0],
          )) as any;
          if (balance1 !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[0],
              balance: balance1,
            });
          }

          const balance2 = (await getBalance(
            pool,
            pool.supplyAssets[1],
          )) as any;
          if (balance2 !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[1],
              balance: balance2,
            });
          }
        }
      }
      setState(items);
      items.length === 0 && onDataNotPresent();
    };

    if (!account) {
      setState([]);
      return;
    }
    getData().catch(console.error);
  }, [account, synBlock, onDataNotPresent]);

  if (state.length === 0 || !account) {
    return <></>;
  }

  return (
    <div className="tw-my-5 tw-text-center">
      <p className="tw-text-white tw-text-xl">
        {t(translations.liquidity.transferNote)}
      </p>

      <ActionButton
        className="mx-auto tw-mt-4 tw-rounded-lg tw-w-32"
        textClassName="tw-text-base tw-font-semibold"
        text={t(translations.liquidity.transfer)}
        onClick={() => setTransferDialog(true)}
      />

      <PoolTransferDialog
        showModal={transferDialog}
        onCloseModal={() => setTransferDialog(false)}
      >
        <div className="tw-flex tw-flex-col">
          {state.map(item => (
            <AmmPool
              key={item.pool + '-' + item.asset.asset}
              pool={item.pool}
              asset={item.asset}
              balance={item.balance}
            />
          ))}
        </div>
      </PoolTransferDialog>
    </div>
  );
}
