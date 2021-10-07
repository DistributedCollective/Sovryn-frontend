import cn from 'classnames';
import { useWalletContext } from '@sovryn/react-wallet';
import { bignumber } from 'mathjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, Translation, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AmountInput } from 'app/components/Form/AmountInput';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { useMaintenance } from 'app/hooks/useMaintenance';
import settingImg from 'assets/images/settings-blue.svg';
import { discordInvite } from 'utils/classifiers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { getLendingContractName } from '../../../../../utils/blockchain/contract-helpers';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpatual-pair-dictionary';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { AdvancedSettingDialog } from '../AdvancedSettingDialog';
import { Button } from '../Button';
import { CollateralAssets } from '../CollateralAssets';
import { LeverageSelector } from '../LeverageSelector';
import { useGetEstimatedMarginDetails } from '../../../../hooks/trading/useGetEstimatedMarginDetails';
import { LiquidationPrice } from '../LiquidationPrice';
import { useCurrentPositionPrice } from '../../../../hooks/trading/useCurrentPositionPrice';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { usePerpetual_resolvePairTokens } from '../../hooks/usePerpetual_resolvePairTokens';
import { DataCard } from '../DataCard';
import classNames from 'classnames';
import { ActionButton } from '../../../../components/Form/ActionButton';
import { PerpetualPageModals, PerpetualTradeType } from '../../types';
import { TradeType } from '../RecentTradesTable/types';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Input } from '../../../../components/Input';

interface ITradeFormProps {
  pairType: PerpetualPairType;
}

export const TradeForm: React.FC<ITradeFormProps> = ({ pairType }) => {
  const { t } = useTranslation();
  const { connected, connect } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);

  const [amountA, setAmount] = useState<string>('');
  const [positionType, setPosition] = useState<TradingPosition>(
    TradingPosition.LONG,
  );

  const [tradeType, setTradeType] = useState<PerpetualTradeType>(
    PerpetualTradeType.MARKET,
  );

  const weiAmount = useWeiAmount(amountA);
  const { position, amount, collateral, leverage } = useSelector(
    selectPerpetualPage,
  );
  const [slippage, setSlippage] = useState(0.5);
  const dispatch = useDispatch();

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);
  const asset = useMemo(() => AssetsDictionary.get(collateral), [collateral]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = usePerpetual_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const { value: estimations } = useGetEstimatedMarginDetails(
    loanToken,
    leverage,
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    collateralToken,
  );

  const { minReturn } = useSlippage(estimations.collateral, slippage);
  const submit = useCallback(e => dispatch(actions.setPosition(e)), [dispatch]);

  const bindSelectPosition = useCallback(
    (postion: TradingPosition) => () => {
      submit(postion);
      setPosition(postion);
    },
    [submit, setPosition],
  );

  const bindSelectTradeType = useCallback(
    (tradeType: PerpetualTradeType) => () => {
      setTradeType(tradeType);
    },
    [setTradeType],
  );

  const onShowSettings = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.TRADE_SETTINGS));
  }, [dispatch]);

  const { price, loading } = useCurrentPositionPrice(
    loanToken,
    collateralToken,
    estimations.principal,
    positionType === TradingPosition.LONG,
  );

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

  if (!connected) {
    return (
      <DataCard
        className="tw-flex-grow tw-text-xs"
        title={t(translations.perpetualPage.tradeForm.titles.welcome)}
      >
        <p>{t(translations.perpetualPage.tradeForm.text.welcome1)}</p>
        <p className="tw-mb-2">
          {t(translations.perpetualPage.tradeForm.text.welcome2)}
        </p>
        <ul className="tw-ml-4 tw-mb-4 tw-list-disc">
          <Trans
            i18nKey={translations.perpetualPage.tradeForm.text.welcome3}
            components={[<li className="tw-mb-2" />]}
          />
        </ul>
        <p className="tw-mb-10">
          {/* TODO: add href to quickstart guide */}
          <Trans
            i18nKey={translations.perpetualPage.tradeForm.text.welcome4}
            components={[
              <a href="https://wiki.sovryn.app/">Quickstart Guide</a>,
            ]}
          />
        </p>
        <button
          className="tw-w-full tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-05 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
          onClick={connect}
        >
          {t(translations.perpetualPage.tradeForm.buttons.connect)}
        </button>
      </DataCard>
    );
  } else {
    return (
      <>
        <DataCard title={t(translations.perpetualPage.tradeForm.titles.order)}>
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-2.5 tw-mb-6">
            <button
              className={classNames(
                'tw-w-full tw-h-8 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-long tw-rounded-lg',
                position !== TradingPosition.LONG &&
                  'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
              )}
              onClick={bindSelectPosition(TradingPosition.LONG)}
              // disabled={!validate || !connected || openTradesLocked}
            >
              {t(translations.perpetualPage.tradeForm.buttons.buy)}
            </button>
            <button
              className={classNames(
                'tw-w-full tw-h-8 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-short tw-rounded-lg',
                position !== TradingPosition.SHORT &&
                  'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
              )}
              onClick={bindSelectPosition(TradingPosition.SHORT)}
            >
              {t(translations.perpetualPage.tradeForm.buttons.sell)}
            </button>
          </div>
          <div className="tw-flex tw-flex-row tw-items-start">
            <button
              className={classNames(
                'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-base tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
                tradeType !== PerpetualTradeType.MARKET &&
                  'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
              )}
              onClick={bindSelectTradeType(PerpetualTradeType.MARKET)}
              // disabled={!validate || !connected || openTradesLocked}
            >
              {t(translations.perpetualPage.tradeForm.buttons.market)}
            </button>
            <button
              className={classNames(
                'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-base tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
                tradeType !== PerpetualTradeType.LIMIT &&
                  'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
              )}
              onClick={bindSelectTradeType(PerpetualTradeType.LIMIT)}
            >
              {t(translations.perpetualPage.tradeForm.buttons.limit)}
            </button>
          </div>
          <div className="tw-mw-340 tw-mx-auto tw-mt-6">
            <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
              <label>
                {t(translations.perpetualPage.tradeForm.labels.orderValue)}
              </label>
              <div className="tw-mx-4 tw-text-right">
                <AssetSymbolRenderer asset={pair.shortAsset} />
              </div>
              <Input
                className="tw-w-2/5"
                type="number"
                step={0.001}
                min={0}
                onChange={console.log}
              />
            </div>
            {tradeType === PerpetualTradeType.LIMIT && (
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
                <label>
                  {t(translations.perpetualPage.tradeForm.labels.limitPrice)}
                </label>
                <div className="tw-mx-4 tw-text-right">
                  <AssetSymbolRenderer asset={pair.longAsset} />
                </div>
                <Input
                  className="tw-w-2/5"
                  type="number"
                  step={0.1}
                  max={0}
                  onChange={console.log}
                />
              </div>
            )}

            <FormGroup
              label={t(translations.perpetualPage.tradeForm.labels.leverage)}
              className="tw-p-4 tw-pb-1 tw-mt-8 tw-mb-2 tw-bg-gray-4 tw-rounded-lg"
            >
              <LeverageSelector
                value={leverage}
                steps={[1, 2, 3, 5, 10, 15]}
                onChange={value => dispatch(actions.setLeverage(value))}
              />
            </FormGroup>

            <div className="tw-text-secondary tw-text-xs tw-flex">
              <button className="tw-flex tw-flex-row" onClick={onShowSettings}>
                <Trans
                  i18nKey={translations.marginTradeForm.fields.advancedSettings}
                />
                <img
                  className="tw-ml-2"
                  alt="setting"
                  src={settingImg}
                  onClick={() => {
                    console.log('1123');
                  }}
                />
              </button>
            </div>
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
        </DataCard>
        <AdvancedSettingDialog />
        {/* <TradeDialog /> */}
      </>
    );
  }
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
