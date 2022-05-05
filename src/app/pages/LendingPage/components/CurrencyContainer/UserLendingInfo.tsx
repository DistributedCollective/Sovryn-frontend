import React, { useEffect, useMemo } from 'react';
import { bignumber } from 'mathjs';
import { useTranslation } from 'react-i18next';

import { AssetRenderer } from 'app/components/AssetRenderer';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { useLending_assetBalanceOf } from 'app/hooks/lending/useLending_assetBalanceOf';
import { useLending_balanceOf } from 'app/hooks/lending/useLending_balanceOf';
import { useLending_checkpointPrice } from 'app/hooks/lending/useLending_checkpointPrice';
import { useLending_tokenPrice } from 'app/hooks/lending/useLending_tokenPrice';
import { weiToFixed, weiTo18 } from 'utils/blockchain/math-helpers';
import { useLending_profitOf } from 'app/hooks/lending/useLending_profitOf';
import { useAccount } from 'app/hooks/useAccount';
import { useLiquidityMining_getUserAccumulatedReward } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserAccumulatedReward';
import { useLending_recentRewardSOV } from 'app/hooks/lending/useLending_recentRewardSOV';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { LendingPool } from 'utils/models/lending-pool';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';

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
  const assetDecimals = lendingPool.getAssetDetails().decimals;
  const {
    value: rewards,
    loading: rewardsLoading,
  } = useLiquidityMining_getUserAccumulatedReward(
    getLendingContract(asset).address,
  );

  const recentRewardSOV = useLending_recentRewardSOV(asset);

  const { value: profitCall, loading: profitLoading } = useLending_profitOf(
    asset,
    account,
  );
  const {
    value: balanceCall,
    loading: balanceLoading,
  } = useLending_assetBalanceOf(asset, account);

  const {
    value: totalBalance,
    loading: balanceOfLoading,
  } = useLending_balanceOf(asset, account);

  const {
    value: checkpointPrice,
    loading: checkpointLoading,
  } = useLending_checkpointPrice(asset, account);

  const {
    value: tokenPrice,
    loading: tokenPriceLoading,
  } = useLending_tokenPrice(asset);

  const { useLM } = LendingPoolDictionary.get(asset);

  // this only gets used for LM enabled lending pools
  const totalProfit = useMemo(
    () =>
      bignumber(tokenPrice)
        .sub(checkpointPrice)
        .mul(totalBalance)
        .div(Math.pow(10, assetDecimals))
        .add(profitCall)
        .toFixed(0),
    [profitCall, totalBalance, checkpointPrice, tokenPrice, assetDecimals],
  );

  // calculation for LM enabled lending pools uses totalProfit to get correct balance
  const poolProfit = useMemo(() => (useLM ? totalProfit : profitCall), [
    useLM,
    totalProfit,
    profitCall,
  ]);

  const balance = useMemo(
    () => bignumber(balanceCall).minus(poolProfit).toString(),
    [balanceCall, poolProfit],
  );

  useEffect(() => {
    if (balance !== '0') {
      onNonEmptyBalance();
    }
  }, [balance, onNonEmptyBalance]);

  return (
    <RowTable className="tw-w-full tw-max-w-lg">
      <thead className="tw-text-sm tw-tracking-normal">
        <tr>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.lendingPage.rowTable.tableHeaders.apy)}
          </th>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.lendingPage.rowTable.tableHeaders.yourDeposit)}
          </th>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.lendingPage.rowTable.tableHeaders.myProfit)}
          </th>
          <th className="tw-pb-2 tw-font-light">
            {t(translations.lendingPage.rowTable.tableHeaders.rewards)}
          </th>
        </tr>
      </thead>

      <TableBody>
        <td>
          <NextSupplyInterestRate
            asset={lendingPool.getAsset()}
            weiAmount={lendingAmount}
            className="tw-text-base"
          />
        </td>
        {balance === '0' && !profitLoading && !balanceLoading && (
          <td colSpan={3} className="tw-italic tw-text-center">
            {t(translations.lendingPage.rowTable.noLiquidityProvided, {
              asset,
            })}
          </td>
        )}
        {(balance !== '0' || profitLoading || balanceLoading) && (
          <>
            <td>
              <LoadableValue
                loading={profitLoading || balanceLoading}
                value={
                  <>
                    {weiToFixed(balance, 8)} <AssetRenderer asset={asset} />
                  </>
                }
                tooltip={<>{weiTo18(balance)}</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={
                  profitLoading ||
                  balanceOfLoading ||
                  checkpointLoading ||
                  tokenPriceLoading
                }
                value={
                  <ProfitLossRenderer
                    isProfit={bignumber(poolProfit).greaterThanOrEqualTo(0)}
                    amount={weiToFixed(poolProfit, 8)}
                    asset={asset}
                  />
                }
                tooltip={<>{weiTo18(poolProfit)}</>}
              />
            </td>
            <td>
              <LoadableValue
                loading={rewardsLoading}
                value={
                  <>
                    {weiToFixed(bignumber(rewards).add(recentRewardSOV), 8)}{' '}
                    <AssetRenderer asset={Asset.SOV} />
                  </>
                }
                tooltip={
                  <>{weiTo18(bignumber(rewards).add(recentRewardSOV))}</>
                }
              />
            </td>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};
