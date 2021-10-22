import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';
import { useMaintenance } from 'app/hooks/useMaintenance';
import settingImg from 'assets/images/settings-blue.svg';
import { discordInvite } from 'utils/classifiers';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { LeverageSelector } from '../LeverageSelector';
import {
  formatAsNumber,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import classNames from 'classnames';
import { PerpetualTrade, PerpetualTradeType } from '../../types';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { Input } from '../../../../components/Input';
import { AssetDecimals } from '../../../../components/AssetValue/types';
import { toWei } from 'web3-utils';

interface ITradeFormProps {
  trade: PerpetualTrade;
  isNewTrade?: boolean;
  onChange: (trade: PerpetualTrade) => void;
  onSubmit: () => void;
  onOpenSlippage: () => void;
}

export const TradeForm: React.FC<ITradeFormProps> = ({
  trade,
  isNewTrade,
  onChange,
  onSubmit,
  onOpenSlippage,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const inMaintenance = checkMaintenance(States.PERPETUAL_TRADES);

  const amount = useMemo(() => weiToNumberFormat(trade.amount, 3), [
    trade.amount,
  ]);
  const onChangeOrderAmount = useCallback(
    (amount: string) => {
      onChange({ ...trade, amount: toWei(amount) });
    },
    [trade, onChange],
  );

  const limit = useMemo(() => weiToNumberFormat(trade.amount, 2), [
    trade.amount,
  ]);
  const onChangeOrderLimit = useCallback(
    (limit: string) => onChange({ ...trade, limit: toWei(limit) }),
    [trade, onChange],
  );

  const onChangeLeverage = useCallback(
    (leverage: number) => {
      onChange({ ...trade, leverage });
    },
    [trade, onChange],
  );

  const pair = useMemo(() => PerpetualPairDictionary.get(trade.pairType), [
    trade.pairType,
  ]);

  const collateralToken = useMemo(
    () => AssetsDictionary.get(trade.collateral),
    [trade.collateral],
  );

  const bindSelectPosition = useCallback(
    (position: TradingPosition) => () => onChange({ ...trade, position }),
    [trade, onChange],
  );

  const bindSelectTradeType = useCallback(
    (tradeType: PerpetualTradeType) => () => onChange({ ...trade, tradeType }),
    [trade, onChange],
  );

  const tradeButtonLabel = useMemo(() => {
    const i18nKey = {
      LONG_LIMIT: translations.perpetualPage.tradeForm.buttons.buyLimit,
      LONG_MARKET: translations.perpetualPage.tradeForm.buttons.buyMarket,
      SHORT_LIMIT: translations.perpetualPage.tradeForm.buttons.sellLimit,
      SHORT_MARKET: translations.perpetualPage.tradeForm.buttons.sellMarket,
    }[`${trade.position}_${trade.tradeType}`];
    console.log(i18nKey);

    return i18nKey && t(i18nKey);
  }, [t, trade.position, trade.tradeType]);

  const price = useMemo(() => {
    // TODO implement price calculator;
    return 1337.1337;
  }, []);

  return (
    <div className="tw-relative tw-pb-16">
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-2.5 tw-mb-5">
        <button
          className={classNames(
            'tw-w-full tw-h-8 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-long tw-rounded-lg',
            trade.position !== TradingPosition.LONG &&
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
            trade.position !== TradingPosition.SHORT &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectPosition(TradingPosition.SHORT)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.sell)}
        </button>
      </div>
      <div className="tw-flex tw-flex-row tw-items-start tw-mb-5">
        <button
          className={classNames(
            'tw-h-8 tw-px-3 tw-py-1 tw-font-semibold tw-text-base tw-text-sov-white tw-bg-gray-7 tw-rounded-lg',
            trade.tradeType !== PerpetualTradeType.MARKET &&
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
            trade.tradeType !== PerpetualTradeType.LIMIT &&
              'tw-opacity-25 hover:tw-opacity-100 tw-transition-opacity tw-duration-300',
          )}
          onClick={bindSelectTradeType(PerpetualTradeType.LIMIT)}
        >
          {t(translations.perpetualPage.tradeForm.buttons.limit)}
        </button>
      </div>
      <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm">
        <label>
          {t(translations.perpetualPage.tradeForm.labels.orderValue)}
        </label>
        <div className="tw-mx-4 tw-text-right">
          <AssetSymbolRenderer assetString={pair.shortAsset} />
        </div>
        <Input
          className="tw-w-2/5"
          type="number"
          value={amount}
          step={0.002}
          min={0}
          onChange={onChangeOrderAmount}
        />
      </div>
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-items-center tw-justify-between tw-mb-4 tw-text-sm',
          trade.tradeType !== PerpetualTradeType.LIMIT && 'tw-hidden',
        )}
      >
        <label>
          {t(translations.perpetualPage.tradeForm.labels.limitPrice)}
        </label>
        <div className="tw-mx-4 tw-text-right">
          <AssetSymbolRenderer assetString={pair.longAsset} />
        </div>
        <Input
          className="tw-w-2/5"
          type="number"
          value={limit}
          step={0.1}
          min={0}
          onChange={onChangeOrderLimit}
        />
      </div>

      <FormGroup
        label={t(translations.perpetualPage.tradeForm.labels.leverage)}
        className="tw-p-4 tw-pb-1 tw-mt-4 tw-mb-2 tw-bg-gray-4 tw-rounded-lg"
      >
        <LeverageSelector
          value={trade.leverage}
          steps={[1, 2, 3, 5, 10, 15]}
          onChange={onChangeLeverage}
        />
      </FormGroup>

      <div className="tw-mb-2 tw-text-secondary tw-text-xs">
        <button className="tw-flex tw-flex-row" onClick={onOpenSlippage}>
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
      <div className="tw-absolute tw-bottom-4 tw-left-4 tw-right-4">
        {!inMaintenance ? (
          <button
            className={classNames(
              'tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full tw-h-12 tw-px-4 tw-font-semibold tw-text-base tw-text-white tw-bg-trade-long tw-rounded-lg tw-opacity-100 hover:tw-opacity-75 tw-transition-opacity tw-duration-300',
              trade.position === TradingPosition.LONG
                ? 'tw-bg-trade-long'
                : 'tw-bg-trade-short',
            )}
            onClick={onSubmit}
            // disabled={!validate || !connected || openTradesLocked}
          >
            <span className="tw-mr-2">{tradeButtonLabel}</span>
            <span>
              {formatAsNumber(amount, AssetDecimals[pair.shortAsset])}
              {` @ ${trade.position === TradingPosition.LONG ? '≥' : '≤'} `}
              {formatAsNumber(price, AssetDecimals[pair.longAsset])}
            </span>
          </button>
        ) : (
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
    </div>
  );
};
