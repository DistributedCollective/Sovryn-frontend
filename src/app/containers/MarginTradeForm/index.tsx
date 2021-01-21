/**
 *
 * MarginTradeForm
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { min, bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { TradingPositionSelector } from '../../components/TradingPositionSelector';
import { LeverageSelector } from '../../components/LeverageSelector';
import { TradingPosition } from '../../../types/trading-position';
import { BorrowLiquidationPrice } from '../../components/BorrowLiquidationPrice';
import { useSelector } from 'react-redux';
import { selectTradingPage } from '../TradingPage/selectors';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
import { BorrowInterestRate } from '../../components/BorrowInterestRate';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { AmountField } from '../AmountField';
import { FormSelect } from '../../components/FormSelect';
import { FieldGroup } from '../../components/FieldGroup';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { TradeButton } from '../../components/TradeButton';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useApproveAndTrade } from '../../hooks/trading/useApproveAndTrade';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { weiTo18, weiTo4 } from '../../../utils/blockchain/math-helpers';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useLending_transactionLimit } from '../../hooks/lending/useLending_transactionLimit';
import { useTrading_resolvePairTokens } from '../../hooks/trading/useTrading_resolvePairTokens';
import { maxMinusFee } from '../../../utils/helpers';
import { useTrading_testRates } from '../../hooks/trading/useTrading_testRates';

const s = translations.marginTradeForm;

export function MarginTradeForm() {
  const isConnected = useCanInteract();
  const { tradingPair } = useSelector(selectTradingPage);

  const pair = TradingPairDictionary.get(tradingPair);

  const { t } = useTranslation();

  const [position, setPosition] = useState(TradingPosition.LONG);
  const [leverage, setLeverage] = useState(2);
  const [amount, setAmount] = useState('');
  const [collateral, setCollateral] = useState(
    pair.getCollateralForPosition(position)[0],
  );

  const weiAmount = useWeiAmount(amount);

  const options = (position === TradingPosition.LONG
    ? pair.getLongCollateral()
    : pair.getShortCollateral()
  ).map(item => ({ key: item, label: AssetsDictionary.get(item).symbol }));

  const color =
    position === TradingPosition.LONG ? 'var(--teal)' : 'var(--Muted_red)';

  useEffect(() => {
    setCollateral(pair.getCollateralForPosition(position)[0]);
  }, [position, pair]);

  const { trade, loading, txHash, status } = useApproveAndTrade(
    pair,
    position,
    pair.getAssetForPosition(position),
    collateral,
    leverage,
    weiAmount,
  );

  const { value: tokenBalance } = useAssetBalanceOf(collateral);
  const {
    value: maxAmount,
    loading: loadingLimit,
  } = useLending_transactionLimit(
    pair.getAssetForPosition(position),
    collateral,
  );

  const valid = useIsAmountWithinLimits(
    weiAmount,
    '1',
    maxAmount !== '0'
      ? min(bignumber(tokenBalance), bignumber(maxAmount))
      : tokenBalance,
  );

  const { state } = useLocation();

  useEffect(() => {
    const params: any = (state as any)?.params;
    if (params?.action && params?.action === 'trade' && params?.asset) {
      const item = options.find(item => item.key === params.asset);
      if (item) {
        setCollateral(item.key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const { loanToken, collateralToken } = useTrading_resolvePairTokens(
    pair,
    position,
    pair.getAssetForPosition(position),
    collateral,
  );

  const { diff } = useTrading_testRates(loanToken, collateralToken, weiAmount);

  return (
    <>
      <TradingPositionSelector
        value={position}
        onChange={value => setPosition(value)}
      />
      <LeverageSelector
        min={2}
        max={5}
        value={leverage}
        onChange={value => setLeverage(value)}
        position={position}
      />
      <div className="row mt-3">
        <div className="col-6 pr-1">
          <BorrowLiquidationPrice
            asset={pair.getAsset()}
            leverage={leverage}
            position={position}
            labelColor={color}
          />
        </div>
        <div className="col-6 pl-1">
          <BorrowInterestRate
            asset={loanToken}
            collateral={collateral}
            weiAmount={weiAmount}
            leverage={leverage}
            labelColor={color}
          />
        </div>
      </div>
      <div className="position-relative">
        <div className="row">
          <div className="col-6 pr-1">
            <FieldGroup label={t(s.fields.currency)} labelColor={color}>
              <FormSelect
                onChange={value => setCollateral(value.key)}
                placeholder={t(s.fields.currency_placeholder)}
                value={collateral}
                items={options}
              />
            </FieldGroup>
          </div>
          <div className="col-6 pl-1">
            <FieldGroup
              label={
                <>
                  {t(s.fields.amount)}{' '}
                  {maxAmount !== '0' && !loadingLimit && (
                    <span className="text-muted">
                      (Max: {weiTo4(maxAmount)} {collateral})
                    </span>
                  )}
                </>
              }
              labelColor={color}
            >
              <AmountField
                onChange={value => setAmount(value)}
                onMaxClicked={() =>
                  setAmount(weiTo18(maxMinusFee(tokenBalance, collateral)))
                }
                value={amount}
              />
            </FieldGroup>
          </div>
        </div>
        <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
          <div className="mb-3 mb-lg-0">
            <AssetWalletBalance asset={collateral} />
          </div>
          <TradeButton
            text={t(s.buttons.submit)}
            onClick={() => trade()}
            disabled={!isConnected || loading || !valid || diff > 5}
            textColor={color}
            loading={loading}
            tooltip={
              diff > 5 ? (
                <>
                  <p className="mb-1">{t(s.liquidity.line_1)}</p>
                  <p className="mb-0">{t(s.liquidity.line_2)}</p>
                </>
              ) : undefined
            }
          />
        </div>
        <div className="text-white">
          <SendTxProgress
            status={status}
            txHash={txHash}
            loading={loading}
            position={position}
          />
        </div>
      </div>
    </>
  );
}
