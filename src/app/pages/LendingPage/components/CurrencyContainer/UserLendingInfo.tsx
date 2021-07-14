import { bignumber } from 'mathjs';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AssetRenderer } from 'app/components/AssetRenderer';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';
import { TableBodyData, TableHeader } from 'app/components/FinanceV2Components/RowTable/styled';
import { LoadableValue } from 'app/components/LoadableValue';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { useLending_assetBalanceOf } from 'app/hooks/lending/useLending_assetBalanceOf';
import { useLending_profitOf } from 'app/hooks/lending/useLending_profitOf';
import { useAccount } from 'app/hooks/useAccount';
import { useLiquidityMining_getPoolId } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getPoolId';
import { useLiquidityMining_getUserAccumulatedReward } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserAccumulatedReward';
import { useLiquidityMining_getUserInfoList } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserInfoList';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { LendingPool } from 'utils/models/lending-pool';

import { RowTable } from '../../../../components/FinanceV2Components/RowTable';
import { TableBody } from '../../../../components/FinanceV2Components/RowTable/TableBody';

interface IUserLendingInfoProps {
  lendingPool: LendingPool;
  lendingAmount: string;
  onNonEmptyBalance: () => void;
}

export const UserLendingInfo: React.FC<IUserLendingInfoProps> = ({
  lendingPool,
  lendingAmount,
  onNonEmptyBalance,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const asset = lendingPool.getAsset();
  const { value: rewards } = useLiquidityMining_getUserAccumulatedReward(
    getLendingContract(asset).address,
  );
  console.log('reward,', weiToFixed(rewards, 8));
  console.log('userInfoList: ', useLiquidityMining_getUserInfoList());
  console.log(
    'PoolId: ',
    useLiquidityMining_getPoolId(getLendingContract(asset).address),
  );
  const { value: profitCall, loading: pLoading } = useLending_profitOf(
    asset,
    account,
  );
  const { value: balanceCall, loading: bLoading } = useLending_assetBalanceOf(
    asset,
    account,
  );

  const balance = useMemo(() => {
    return bignumber(balanceCall).minus(profitCall).toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceCall, profitCall, asset]);

  useEffect(() => {
    if (balance !== '0') {
      onNonEmptyBalance();
    }
  }, [balance, onNonEmptyBalance]);

  return (
    <RowTable className="tw-w-100 tw-max-w-31.25rem">
      <thead className="tw-text-sm tw-tracking-normal">
        <tr>
          <TableHeader>
            {t(translations.lendingPage.rowTable.tableHeaders.apy)}
          </TableHeader>
          <TableHeader>
            {t(translations.lendingPage.rowTable.tableHeaders.yourDeposit)}
          </TableHeader>
          <TableHeader>
            {t(translations.lendingPage.rowTable.tableHeaders.myProfit)}
          </TableHeader>
          <TableHeader>
            {t(translations.lendingPage.rowTable.tableHeaders.rewards)}
          </TableHeader>
        </tr>
      </thead>

      <TableBody>
        <TableBodyData>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
            className="tw-text-base"
          />
        </TableBodyData>
        {balance === '0' && !pLoading && !bLoading && (
          <td
            colSpan={3}
            className="tw-text-xs tw-italic tw-font-extralight tw-text-center"
          >
            {t(translations.lendingPage.rowTable.noLiquidityProvided, {
              asset,
            })}
          </td>
        )}
        {(balance !== '0' || pLoading || bLoading) && (
          <>
            <TableBodyData>
              <LoadableValue
                loading={pLoading || bLoading}
                value={
                  <>
                    {weiToFixed(balance, 4)} <AssetRenderer asset={asset} />
                  </>
                }
              />
            </TableBodyData>
            <TableBodyData>
              <LoadableValue
                loading={pLoading}
                value={
                  <ProfitLossRenderer
                    isProfit={bignumber(profitCall).greaterThanOrEqualTo(0)}
                    amount={weiToFixed(profitCall, 8)}
                    asset={asset}
                  />
                }
              />
            </TableBodyData>
            <TableBodyData>
              {weiToFixed(rewards, 8)} <AssetRenderer asset={Asset.SOV} />
            </TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};
