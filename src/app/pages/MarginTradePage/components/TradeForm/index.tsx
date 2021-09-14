import React, { useEffect, useMemo, useState } from 'react';
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
import { toNumberFormat } from 'utils/display-text/format';
import { SlippageDialog } from '../../components/ClosePositionDialog/Dialogs/SlippageDialog';
import { toWei, weiTo18 } from 'utils/blockchain/math-helpers';
import { ActiveLoan } from 'types/active-loan';

interface ITradeFormProps {
  pairType: TradingPairType;
}
export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const [openSlippage, setOpenSlippage] = useState(false);
  const [amountA, setAmount] = useState<string>('');
  const [positionType, setPositionType] = useState<TradingPosition>(
    TradingPosition.LONG,
  );
  const weiAmount = useWeiAmount(amountA);
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
  const submit = e => dispatch(actions.submit(e));

  console.log('estimations', estimations);

  const { price } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    estimations.principal,
    positionType === TradingPosition.SHORT,
  );
  console.log(price);

  useEffect(() => {
    dispatch(actions.setAmount(weiAmount));
  }, [weiAmount, dispatch]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
    setAmount('0');
  }, [pair.collaterals, collateral, dispatch]);

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance)
    );
  }, [weiAmount, tokenBalance]);
  const [slippage, setSlippage] = useState(0.5);

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0">
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.long)}
              position={TradingPosition.LONG}
              onClick={() => setPositionType(TradingPosition.LONG)}
              className={cn('tw-capitalize tw-h-10 tw-opacity-50', {
                'tw-opacity-100': positionType === TradingPosition.LONG,
              })}
            />
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.short)}
              position={TradingPosition.SHORT}
              onClick={() => setPositionType(TradingPosition.SHORT)}
              className={cn('tw-capitalize tw-h-10 tw-opacity-50', {
                'tw-opacity-100': positionType === TradingPosition.SHORT,
              })}
            />
          </div>
        )}
        <div className="tw-mw-340 tw-mx-auto tw-mt-5">
          <CollateralAssets
            value={collateral}
            onChange={value => dispatch(actions.setCollateral(value))}
            options={pair.collaterals}
          />
          <AvailableBalance asset={collateral} />
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.leverage)}
            className="tw-mb-6 tw-mt-6"
          >
            <LeverageSelector
              value={leverage}
              onChange={value => dispatch(actions.setLeverage(value))}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={amountA}
              onChange={value => setAmount(value)}
              asset={collateral}
            />
          </FormGroup>

          <div className="tw-mt-3 tw-mb-5 tw-text-secondary tw-text-xs tw-flex">
            <ActionButton
              text={
                <div className="tw-flex">
                  {t(translations.marginTradeForm.fields.advancedSettings)}
                  <img className="tw-ml-1" src={settingIcon} alt="setting" />
                </div>
              }
              onClick={() => setOpenSlippage(true)}
              className="tw-border-none tw-ml-0 tw-p-0 tw-h-auto"
              textClassName="tw-text-xs tw-overflow-visible tw-text-secondary"
            />
          </div>

          <LabelValuePair
            label={t(translations.marginTradeForm.fields.esEntryPrice)}
            value={
              <>
                {toNumberFormat(price, 6)} {pair.longDetails.symbol}
              </>
            }
          />
          <LabelValuePair
            label={t(translations.marginTradeForm.fields.esLiquidationPrice)}
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
            value={<>%</>}
          />

          <div className="tw-mt-6">
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
          </div>

          <Button
            text={
              positionType === TradingPosition.LONG
                ? t(
                    translations.marginTradePage.tradeForm.placePosition
                      .placeLong,
                  )
                : t(
                    translations.marginTradePage.tradeForm.placePosition
                      .placeShort,
                  )
            }
            position={positionType}
            onClick={submit}
            disabled={!validate || !connected || openTradesLocked}
          />
        </div>
      </div>

      <SlippageDialog
        isOpen={openSlippage}
        onClose={() => setOpenSlippage(false)}
        amount={toWei(amountA)}
        value={slippage}
        asset={collateral}
        onChange={value => setSlippage(value)}
      />
      <TradeDialog />
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
        'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-3',
        props.className,
      )}
    >
      <div className="tw-truncate ">{props.label}</div>
      <div className="tw-truncate tw-text-right">{props.value}</div>
    </div>
  );
}

function getEntryPrice(item: ActiveLoan, position: TradingPosition) {
  if (position === TradingPosition.LONG) return Number(weiTo18(item.startRate));
  return 1 / Number(weiTo18(item.startRate));
}

function getInterestAPR(item: ActiveLoan) {
  return bignumber(item.interestOwedPerDay)
    .mul(365)
    .div(item.principal)
    .mul(100)
    .toNumber();
}
