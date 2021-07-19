import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { RowTable } from 'app/components/FinanceV2Components/RowTable';
import { TableBody } from 'app/components/FinanceV2Components/RowTable/TableBody';
import {
  TableBodyData,
  TableHeader,
} from 'app/components/FinanceV2Components/RowTable/styled';
import { LendingPool } from 'utils/models/lending-pool';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { useLending_profitOf } from 'app/hooks/lending/useLending_profitOf';
import { useLending_assetBalanceOf } from 'app/hooks/lending/useLending_assetBalanceOf';
import { useLending_balanceOf } from 'app/hooks/lending/useLending_balanceOf';
import { useLending_checkpointPrice } from 'app/hooks/lending/useLending_checkpointPrice';
import { useLending_tokenPrice } from 'app/hooks/lending/useLending_tokenPrice';
import { bignumber } from 'mathjs';
import { weiToFixed, weiTo18 } from 'utils/blockchain/math-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';
import { LoadableValue } from 'app/components/LoadableValue';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useLiquidityMining_getUserAccumulatedReward } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserAccumulatedReward';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { Asset } from 'types';

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
  const {
    value: rewards,
    loading: rewardsLoading,
  } = useLiquidityMining_getUserAccumulatedReward(
    getLendingContract(asset).address,
  );
  const { value: profitCall, loading: profitLoading } = useLending_profitOf(
    asset,
    account,
  );
  const {
    value: balanceCall,
    loading: balanceLoading,
  } = useLending_assetBalanceOf(asset, account);

  const {
    value: balanceOfCall,
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

  const balance = useMemo(() => {
    return bignumber(balanceCall).minus(profitCall).toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceCall, profitCall, asset]);

  const totalProfit = useMemo(() => {
    return bignumber(tokenPrice)
      .sub(checkpointPrice)
      .mul(balanceOfCall)
      .div(10e18)
      .add(profitCall)
      .toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitCall, balanceOfCall, checkpointPrice, tokenPrice, asset]);

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
        {balance === '0' && !profitLoading && !balanceLoading && (
          <td
            colSpan={3}
            className="tw-text-xs tw-italic tw-font-extralight tw-text-center"
          >
            {t(translations.lendingPage.rowTable.noLiquidityProvided, {
              asset,
            })}
          </td>
        )}
        {(balance !== '0' ||
          profitLoading ||
          balanceLoading ||
          balanceOfLoading) && (
          <>
            <TableBodyData>
              <LoadableValue
                loading={profitLoading || balanceLoading}
                value={
                  <>
                    {weiToFixed(balance, 8)} <AssetRenderer asset={asset} />
                  </>
                }
                tooltip={<>{weiTo18(balance)}</>}
              />
            </TableBodyData>
            <TableBodyData>
              <LoadableValue
                loading={
                  profitLoading ||
                  balanceLoading ||
                  balanceOfLoading ||
                  checkpointLoading ||
                  tokenPriceLoading
                }
                value={
                  <ProfitLossRenderer
                    isProfit={bignumber(totalProfit).greaterThanOrEqualTo(0)}
                    amount={weiToFixed(totalProfit, 8)}
                    asset={asset}
                  />
                }
                tooltip={<>{weiTo18(profitCall)}</>}
              />
            </TableBodyData>
            <TableBodyData>
              <LoadableValue
                loading={rewardsLoading}
                value={
                  <>
                    {weiToFixed(rewards, 8)} <AssetRenderer asset={Asset.SOV} />
                  </>
                }
                tooltip={<>{weiTo18(rewards)}</>}
              />
            </TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};
