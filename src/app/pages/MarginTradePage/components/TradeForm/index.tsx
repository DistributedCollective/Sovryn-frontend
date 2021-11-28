import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { bignumber } from 'mathjs';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { useMaintenance } from 'app/hooks/useMaintenance';
import settingIcon from 'assets/images/settings-blue.svg';
import { discordInvite } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { TradingPosition } from 'types/trading-position';
import {
  TradingPairDictionary,
  TradingPairType,
} from 'utils/dictionaries/trading-pair-dictionary';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { ActionButton } from 'app/components/Form/ActionButton';
import { Button } from '../Button';
import { CollateralAssets } from '../CollateralAssets';
import { LeverageSelector } from '../LeverageSelector';
import { useGetEstimatedMarginDetails } from 'app/hooks/trading/useGetEstimatedMarginDetails';
import { TradeDialog } from '../TradeDialog';
import { LiquidationPrice } from '../LiquidationPrice';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { SlippageForm } from '../SlippageForm';
import { toWei } from 'utils/blockchain/math-helpers';
import { OrderType } from 'app/components/OrderType';
import { OrderTypes } from 'app/components/OrderType/types';
import { MARGIN_SLIPPAGE_DEFAULT } from '../../types';

interface ITradeFormProps {
  pairType: TradingPairType;
}
export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const [openSlippage, setOpenSlippage] = useState(false);
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [slippage, setSlippage] = useState(MARGIN_SLIPPAGE_DEFAULT);
  const weiAmount = useWeiAmount(tradeAmount);
  const [orderType, setOrderType] = useState(OrderTypes.MARKET);
  const { position, amount, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const dispatch = useDispatch();
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);
  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const { value: estimations } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    collateralToken,
  );

  const { price } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    estimations.principal,
    position === TradingPosition.SHORT,
  );

  useEffect(() => {
    dispatch(actions.setAmount(weiAmount));
  }, [weiAmount, dispatch]);

  useEffect(() => {
    if (pair.canOpenLong && !pair.canOpenShort)
      dispatch(actions.submit(TradingPosition.LONG));
    if (!pair.canOpenLong && pair.canOpenShort)
      dispatch(actions.submit(TradingPosition.SHORT));
  }, [pair.canOpenLong, pair.canOpenShort, dispatch]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
    setTradeAmount('0');
  }, [pair.collaterals, collateral, dispatch]);

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance)
    );
  }, [weiAmount, tokenBalance]);

  const [isTradingDialogOpen, setIsTradingDialogOpen] = useState(false);

  const handlePositionLong = useCallback(() => {
    dispatch(actions.submit(TradingPosition.LONG));
  }, [dispatch]);

  const handlePositionShort = useCallback(() => {
    dispatch(actions.submit(TradingPosition.SHORT));
  }, [dispatch]);
  const buttonDisabled = useMemo(
    () => !validate || !connected || openTradesLocked,
    [validate, connected, openTradesLocked],
  );

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-4 tw-mx-auto xl:tw-mx-0 tw-relative">
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
            {pair.canOpenLong && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.long)}
                position={TradingPosition.LONG}
                onClick={handlePositionLong}
                className={cn('tw-capitalize tw-h-8 tw-opacity-50', {
                  'tw-opacity-100': position === TradingPosition.LONG,
                })}
              />
            )}
            {pair.canOpenShort && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.short)}
                position={TradingPosition.SHORT}
                onClick={handlePositionShort}
                className={cn('tw-capitalize tw-h-8 tw-opacity-50', {
                  'tw-opacity-100': position === TradingPosition.SHORT,
                })}
              />
            )}
          </div>
        )}
        <OrderType value={orderType} onChange={setOrderType} />
        <div className="tw-mw-340 tw-mx-auto tw-mt-3">
          <CollateralAssets
            value={collateral}
            onChange={value => dispatch(actions.setCollateral(value))}
            options={pair.collaterals}
          />
          <AvailableBalance asset={collateral} />

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={tradeAmount}
              onChange={value => setTradeAmount(value)}
              asset={collateral}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.leverage)}
            className="tw-mb-4 tw-mt-6 tw-w-full tw-bg-gray-4 tw-rounded-md tw-px-4 tw-py-2"
          >
            <LeverageSelector
              value={leverage}
              onChange={value => dispatch(actions.setLeverage(value))}
            />
          </FormGroup>

          {!openTradesLocked && (
            <>
              <LabelValuePair
                label={t(translations.marginTradeForm.fields.esEntryPrice)}
                value={
                  <>
                    {toNumberFormat(price, 2)} {pair.longDetails.symbol}
                  </>
                }
              />
              <LabelValuePair
                label={t(
                  translations.marginTradeForm.fields.esLiquidationPrice,
                )}
                value={
                  <>
                    <LiquidationPrice
                      asset={pair.shortAsset}
                      assetLong={pair.longAsset}
                      leverage={leverage}
                      position={position}
                    />{' '}
                    {pair.longDetails.symbol}
                  </>
                }
              />
              <LabelValuePair
                label={t(translations.marginTradeForm.fields.interestAPY)}
                value={<>{weiToNumberFormat(estimations.interestRate, 2)} %</>}
              />

              {openTradesLocked && (
                <ErrorBadge
                  content={
                    <Trans
                      i18nKey={translations.maintenance.openMarginTrades}
                      components={[
                        <a
                          href={discordInvite}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                        >
                          x
                        </a>,
                      ]}
                    />
                  }
                />
              )}

              <div className="tw-mb-4 tw-text-secondary tw-text-xs tw-flex">
                <ActionButton
                  text={
                    <div className="tw-flex">
                      {t(translations.marginTradeForm.fields.slippageSettings)}
                      <img
                        className="tw-ml-1"
                        src={settingIcon}
                        alt="setting"
                      />
                    </div>
                  }
                  onClick={() => setOpenSlippage(true)}
                  className="tw-border-none tw-ml-0 tw-p-0 tw-h-auto"
                  textClassName="tw-text-xs tw-overflow-visible tw-text-secondary"
                />
              </div>

              <Button
                text={
                  position === TradingPosition.LONG ? (
                    <>
                      {t(
                        translations.marginTradePage.tradeForm.placePosition
                          .placeLong,
                      )}{' '}
                      {orderType}
                    </>
                  ) : (
                    <>
                      {t(
                        translations.marginTradePage.tradeForm.placePosition
                          .placeShort,
                      )}{' '}
                      {orderType}
                    </>
                  )
                }
                position={position}
                onClick={() => setIsTradingDialogOpen(true)}
                disabled={buttonDisabled}
              />
            </>
          )}
        </div>

        {openSlippage && (
          <SlippageForm
            onClose={() => setOpenSlippage(false)}
            amount={toWei(price)}
            value={slippage}
            asset={collateralToken}
            onChange={value => setSlippage(value)}
            isTrade={true}
          />
        )}
        <TradeDialog
          onCloseModal={() => setIsTradingDialogOpen(false)}
          isOpen={isTradingDialogOpen}
          slippage={slippage}
          orderType={orderType}
        />
      </div>
    </>
  );
};

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={cn(
        'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-2',
        props.className,
      )}
    >
      <div className="tw-truncate ">{props.label}</div>
      <div className="tw-truncate tw-text-right">{props.value}</div>
    </div>
  );
}
