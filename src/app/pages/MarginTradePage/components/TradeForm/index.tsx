import cn from 'classnames';
import { Text } from '@blueprintjs/core';
import { useWalletContext } from '@sovryn/react-wallet';
import { bignumber } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Select } from 'app/components/Form/Select';
import { renderItemNH } from 'app/components/Form/Select/renderers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import settingImg from 'assets/images/settings-blue.svg';
import { discordInvite } from 'utils/classifiers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { getLendingContractName } from '../../../../../utils/blockchain/contract-helpers';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import {
  TradingPairDictionary,
  TradingPairType,
} from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { useTrading_resolvePairTokens } from '../../../../hooks/trading/useTrading_resolvePairTokens';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { selectMarginTradePage } from '../../selectors';
import { actions } from '../../slice';
import { AdvancedSettingDialog } from '../AdvancedSettingDialog';
import { Button } from '../Button';
import { CollateralAssets } from '../CollateralAssets';
import { LeverageSelector } from '../LeverageSelector';
import { useGetEstimatedMarginDetails } from '../../../../hooks/trading/useGetEstimatedMarginDetails';
import { TradeDialog } from '../TradeDialog';
import { LiquidationPrice } from '../LiquidationPrice';
import { useCurrentPositionPrice } from '../../../../hooks/trading/useCurrentPositionPrice';
import { toNumberFormat } from '../../../../../utils/display-text/format';
const pairs = TradingPairDictionary.entries()
  .filter(value => !value[1].deprecated)
  .map(([type, item]) => ({
    key: type,
    label: item.name as string,
  }));

interface ITradeFormProps {
  pairType: TradingPairType;
}
const maintenanceMargin = 15000000000000000000;

export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);

  const [amountA, setAmount] = useState<string>('');
  const [positionType, setPosition] = useState<TradingPosition>(
    TradingPosition.LONG,
  );
  const weiAmount = useWeiAmount(amountA);
  const { position, amount, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const [slippage, setSlippage] = useState(0.5);
  const dispatch = useDispatch();

  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);
  const asset = useMemo(() => AssetsDictionary.get(collateral), [collateral]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const { value: estimations } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    collateralToken,
  );

  const { minReturn } = useSlippage(estimations.collateral, slippage);
  const submit = e => dispatch(actions.submit(e));
  const selectPosition = e => {
    submit(e);
    setPosition(e);
  };

  const { price, loading } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    estimations.principal,
    positionType === TradingPosition.SHORT,
  );
  console.log('positioL ', positionType);
  useEffect(() => {
    dispatch(actions.setAmount(weiAmount));
  }, [weiAmount, dispatch]);

  useEffect(() => {
    if (!pair.collaterals.includes(collateral)) {
      dispatch(actions.setCollateral(pair.collaterals[0]));
    }
  }, [pair.collaterals, collateral, dispatch]);

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(tokenBalance)
    );
  }, [weiAmount, tokenBalance]);

  const buttonDisabled = useMemo(
    () => !validate || !connected || openTradesLocked,
    [validate, connected, openTradesLocked],
  );

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0">
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.long)}
              position={TradingPosition.LONG}
              onClick={selectPosition}
              // disabled={!validate || !connected || openTradesLocked}
            />
            <Button
              text={t(translations.marginTradePage.tradeForm.buttons.short)}
              position={TradingPosition.SHORT}
              onClick={selectPosition}
            />
          </div>
        )}
        <div className="tw-mw-340 tw-mx-auto tw-mt-6">
          {/* <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.pair)}
            className="tw-mb-6"
          >
            <Select
              value={pairType}
              options={pairs}
              filterable={false}
              onChange={value => dispatch(actions.setPairType(value))}
              itemRenderer={renderItemNH}
              valueRenderer={item => (
                <Text ellipsize className="tw-text-center">
                  {item.label}
                </Text>
              )}
            />
          </FormGroup> */}
          <CollateralAssets
            value={collateral}
            onChange={value => dispatch(actions.setCollateral(value))}
            options={pair.collaterals}
          />
          <AvailableBalance asset={collateral} />
          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.leverage)}
            className="tw-mb-6"
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
          <div className="tw-my-6 tw-text-secondary tw-text-xs tw-flex">
            <Trans
              i18nKey={translations.marginTradeForm.fields.advancedSettings}
            />
            <img
              alt="setting"
              src={settingImg}
              onClick={() => {
                console.log('1123');
              }}
            />
          </div>
          <LabelValuePair
            label={t(translations.marginTradeForm.fields.esEntryPrice)}
            value={
              <>
                {toNumberFormat(price, 2)} {pair.longDetails.symbol}
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
        </div>
        <div className="tw-mt-12">
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
        {!openTradesLocked && (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
            {pair.canOpenLong && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.long)}
                position={TradingPosition.LONG}
                onClick={submit}
                disabled={buttonDisabled}
              />
            )}
            {pair.canOpenShort && (
              <Button
                text={t(translations.marginTradePage.tradeForm.buttons.short)}
                position={TradingPosition.SHORT}
                onClick={submit}
                disabled={buttonDisabled}
              />
            )}
          </div>
        )}
      </div>
      <AdvancedSettingDialog />
      {/* <TradeDialog /> */}
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
        'tw-flex tw-text-xs tw-flex-row tw-flex-wrap tw-justify-between tw-space-x-4 tw-mb-4',
        props.className,
      )}
    >
      <div className="tw-truncate ">{props.label}</div>
      <div className="tw-truncate tw-text-right">{props.value}</div>
    </div>
  );
}
