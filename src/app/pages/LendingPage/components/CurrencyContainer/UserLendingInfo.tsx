import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LendingPool } from 'utils/models/lending-pool';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { ProfitLossRenderer } from 'app/components/FinanceV2Components/RowTable/ProfitLossRenderer';
import {
  TableBodyData,
  TableHeader,
} from 'app/components/FinanceV2Components/RowTable/styled';
import { LoadableValue } from 'app/components/LoadableValue';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { useLending_assetBalanceOf } from 'app/hooks/lending/useLending_assetBalanceOf';
import { useLending_profitOf } from 'app/hooks/lending/useLending_profitOf';
import { useLending_balanceOf } from 'app/hooks/lending/useLending_balanceOf';
import { useLending_checkpointPrice } from 'app/hooks/lending/useLending_checkpointPrice';
import { useLending_tokenPrice } from 'app/hooks/lending/useLending_tokenPrice';
import { bignumber } from 'mathjs';
import { weiToFixed, weiTo18 } from 'utils/blockchain/math-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useLiquidityMining_getPoolId } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getPoolId';
import { useLiquidityMining_getUserAccumulatedReward } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserAccumulatedReward';
import { useLiquidityMining_getUserInfoList } from 'app/pages/LiquidityMining/hooks/useLiquidityMining_getUserInfoList';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { getLendingContract } from 'utils/blockchain/contract-helpers';

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
  const {
    value: userInfoList,
    loading: userInfoListLoading,
  } = useLiquidityMining_getUserInfoList();
  const {
    value: poolID,
    loading: poolIDLoading,
  } = useLiquidityMining_getPoolId(getLendingContract(asset).address);

  const recentRewardSOV = useMemo(
    () =>
      userInfoListLoading === false &&
      poolIDLoading === false &&
      userInfoList &&
      userInfoList[poolID] &&
      userInfoList[poolID][2]
        ? userInfoList[poolID][2]
        : 0,
    [userInfoList, poolID, userInfoListLoading, poolIDLoading],
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

  const balance = useMemo(() => {
    return bignumber(balanceCall).minus(profitCall).toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceCall, profitCall, asset]);

  const totalProfit = useMemo(() => {
    return bignumber(tokenPrice)
      .sub(checkpointPrice)
      .mul(totalBalance)
      .div(Math.pow(10, assetDecimals + 1))
      .add(profitCall)
      .toFixed(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitCall, totalBalance, checkpointPrice, tokenPrice, asset]);

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
        {(balance !== '0' || profitLoading || balanceLoading) && (
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
                tooltip={<>{weiTo18(totalProfit)}</>}
              />
            </TableBodyData>
            <TableBodyData>
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
            </TableBodyData>
          </>
        )}
      </TableBody>
    </RowTable>
  );
};
