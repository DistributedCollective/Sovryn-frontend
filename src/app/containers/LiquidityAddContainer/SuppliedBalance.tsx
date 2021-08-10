import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@blueprintjs/core';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types/asset';
import { usePoolToken } from 'app/hooks/amm/usePoolToken';
import { usePoolTokenBalance } from 'app/hooks/amm/usePoolTokenBalance';
import { useRemoveLiquidityReturnAndFee } from 'app/hooks/amm/useRemoveLiquidityReturnAndFee';

interface Props {
  pool: Asset;
  asset: Asset;
}

export function SuppliedBalance({ pool, asset }: Props) {
  const { t } = useTranslation();

  const poolAddress = usePoolToken(pool, asset);
  const poolTokenBalance = usePoolTokenBalance(pool, asset);

  const {
    value: sourceTokenValue,
    loading: sourceTokenLoading,
  } = useRemoveLiquidityReturnAndFee(
    pool,
    poolAddress.value,
    poolTokenBalance.value,
  );

  return (
    <div className="tw-border tw-shadow tw-my-4 tw-p-4 tw-bg-white tw-text-black">
      <div className="tw-grid tw-gap-8 tw-grid-cols-12">
        <div className="tw-col-span-12">
          <div className="tw-font-bold tw-text-sm">
            <LoadableValue
              loading={sourceTokenLoading}
              value={
                <Text ellipsize tagName="span">
                  {weiTo4(sourceTokenValue[0])} {asset}
                </Text>
              }
              tooltip={weiTo18(sourceTokenValue[0])}
            />
          </div>
          <div className="tw-text-sm">
            {t(translations.liquidity.suppliedBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}
