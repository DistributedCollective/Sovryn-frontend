/**
 *
 * MarginTradeForm
 *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingPositionSelector } from '../../components/TradingPositionSelector';
import { LeverageSelector } from '../../components/LeverageSelector';
import { TradingPosition } from '../../../types/trading-position';
import { BorrowLiquidationPrice } from '../../components/BorrowLiquidationPrice';
import { useSelector } from 'react-redux';
import { selectTradingPage } from '../TradingPage/selectors';
import { TradingPairDictionary } from '../../../utils/trading-pair-dictionary';
import { BorrowInterestRate } from '../../components/BorrowInterestRate';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { AmountField } from '../AmountField';
import { FormSelect } from '../../components/FormSelect';
import { FieldGroup } from '../../components/FieldGroup';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { useIsConnected } from '../../hooks/useAccount';
import { TradeButton } from '../../components/TradeButton';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useApproveAndTrade } from '../../hooks/trading/useApproveAndTrade';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';

const s = translations.marginTradeForm;

interface Props {}

export function MarginTradeForm(props: Props) {
  const isConnected = useIsConnected();
  const { tradingPair } = useSelector(selectTradingPage);

  const pair = TradingPairDictionary.get(tradingPair);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

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
  ).map(item => ({ key: item, label: item }));

  const color =
    position === TradingPosition.LONG ? 'var(--teal)' : 'var(--gold)';

  useEffect(() => {
    setCollateral(pair.getCollateralForPosition(position)[0]);
  }, [position, pair]);

  const { trade, loading, txHash, status, type } = useApproveAndTrade(
    pair.getAssetForPosition(position),
    collateral,
    leverage,
    weiAmount,
  );

  const { value: tokenBalance } = useTokenBalanceOf(collateral);

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

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
            asset={pair.getAsset()}
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
            <FieldGroup label={t(s.fields.amount)} labelColor={color}>
              <AmountField
                onChange={value => setAmount(value)}
                onMaxClicked={() => setAmount(weiTo18(tokenBalance))}
                value={amount}
              />
            </FieldGroup>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <AssetWalletBalance asset={collateral} />
          <TradeButton
            text={t(s.buttons.submit)}
            onClick={() => trade()}
            disabled={!isConnected || loading || !valid}
            textColor={color}
          />
        </div>

        <div>
          <SendTxProgress
            status={status}
            txHash={txHash}
            loading={loading}
            type={type}
            position={position}
          />
        </div>
      </div>
    </>
  );
}
