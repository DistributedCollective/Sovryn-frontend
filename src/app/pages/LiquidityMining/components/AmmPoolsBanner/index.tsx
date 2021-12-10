import React, { useEffect, useState } from 'react';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount, useBlockSync } from '../../../../hooks/useAccount';
import ERC20Abi from 'utils/blockchain/abi/erc20.json';
import { Asset } from '../../../../../types';
import { AmmPool } from './AmmPool';
import { PoolTransferDialog } from './PoolTransferDialog';
import { ActionButton } from 'app/components/Form/ActionButton';

import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

const pools = LiquidityPoolDictionary.list();

interface StateInterface {
  pool: AmmLiquidityPool;
  asset: Asset;
  balance: string;
}

interface IAmmPoosBannerProps {
  onDataNotPresent: () => void;
}

export const AmmPoolsBanner: React.FC<IAmmPoosBannerProps> = ({
  onDataNotPresent,
}) => {
  const { t } = useTranslation();

  const account = useAccount();
  const synBlock = useBlockSync();

  const [transferDialog, setTransferDialog] = useState(false);
  const [state, setState] = useState<StateInterface[]>([]);

  useEffect(() => {
    const getBalance = async (pool: AmmLiquidityPool, token: Asset) => {
      return await contractReader.callByAddress(
        pool.getPoolTokenAddress(token)!,
        ERC20Abi,
        'balanceOf',
        [account],
      );
    };

    const getData = async () => {
      const items: StateInterface[] = [];
      for (let pool of pools) {
        const balance = await getBalance(pool, pool.assetA);
        if (typeof balance === 'string' && balance !== '0') {
          items.push({
            pool: pool,
            asset: pool.assetA,
            balance,
          });
        }
        if (pool.converterVersion === 2) {
          const balance = await getBalance(pool, pool.assetB);
          if (typeof balance === 'string' && balance !== '0') {
            items.push({
              pool: pool,
              asset: pool.assetB,
              balance: balance,
            });
          }
        }
      }
      setState(items);
      items.length === 0 && onDataNotPresent();
    };

    if (!account) {
      setState([]);
      onDataNotPresent();
      return;
    }
    getData().catch(console.error);
  }, [account, synBlock, onDataNotPresent]);

  if (state.length === 0 || !account) {
    return <></>;
  }

  return (
    <div className="tw-my-5 tw-text-center">
      <p className="tw-text-sov-white tw-text-xl">
        {t(translations.liquidity.transferNote)}
      </p>

      <ActionButton
        className="tw-mx-auto tw-mt-4 tw-rounded-lg tw-w-32"
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
              key={item.pool.key}
              pool={item.pool}
              asset={item.asset}
              balance={item.balance}
            />
          ))}
        </div>
      </PoolTransferDialog>
    </div>
  );
};
