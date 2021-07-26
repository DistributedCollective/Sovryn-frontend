/**
 *
 * LiquidityRemoveContainer
 *
 */

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { LoadableValue } from '../../components/LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { TradeButton } from '../../components/TradeButton';
import { useIsConnected } from '../../hooks/useAccount';
import { useMaintenance } from '../../hooks/useMaintenance';
import { LiquidityPool } from '../../../utils/models/liquidity-pool';
import { useApproveAndRemoveV1Liquidity } from '../../hooks/amm/useApproveAndRemoveV1Liquidity';

interface Props {
  poolData: LiquidityPool;
  symbol: string;
  balance: { value: string; loading: boolean };
  value: string;
}

export function RemovePoolV1(props: Props) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();

  const weiAmount = useWeiAmount(props.value);

  const tx = useApproveAndRemoveV1Liquidity(
    props.poolData.getAsset(),
    weiAmount,
    props.poolData.getSupplyAssets().map(item => item.getAsset()),
    props.poolData.getSupplyAssets().map(() => '1'),
  );

  const { checkMaintenance, States } = useMaintenance();
  const liquidityLocked = checkMaintenance(States.REMOVE_LIQUIDITY);

  const handleWithdraw = useCallback(() => {
    tx.withdraw();
  }, [tx]);

  const amountValid = () => {
    return (
      Number(weiAmount) > 0 && Number(weiAmount) <= Number(props.balance.value)
    );
  };

  return (
    <>
      <div className="mt-3">
        <SendTxProgress {...tx} displayAbsolute={false} />
      </div>

      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
        <div className="mb-3 mb-lg-0">
          <div>
            <div className="font-weight-bold text-muted mb-2">
              {t(translations.assetWalletBalance.suppliedBalance)}
            </div>
            {!isConnected && (
              <span>{t(translations.assetWalletBalance.accountBalance)}</span>
            )}
            {isConnected && (
              <div className="d-flex flex-row justify-content-start align-items-center">
                <span className="text-muted">{props.symbol}</span>
                <span className="text-white font-weight-bold ml-2">
                  <LoadableValue
                    value={weiToFixed(props.balance.value, 4)}
                    loading={props.balance.loading}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        <TradeButton
          text={t(translations.liquidity.withdraw)}
          onClick={handleWithdraw}
          loading={tx.loading}
          disabled={
            !isConnected || tx.loading || !amountValid() || liquidityLocked
          }
          tooltip={
            liquidityLocked ? (
              <div className="mw-tooltip">
                {t(translations.maintenance.removeLiquidity)}
              </div>
            ) : undefined
          }
        />
      </div>
    </>
  );
}
