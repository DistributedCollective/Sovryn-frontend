import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { OrderTypes, TradingTypes, ITradeFormProps } from '../../types';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { maxMinusFee } from 'utils/helpers';
import { stringToFixedPrecision } from 'utils/display-text/format';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import settingImg from 'assets/images/settings-blue.svg';
import styles from './index.module.scss';
import { LimitOrderSetting } from '../LimitOrderSetting';
import { TradeDialog } from '../TradeDialog';
import { useLimitOrder } from 'app/hooks/useLimitOrder';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import cn from 'classnames';

export const LimitForm: React.FC<ITradeFormProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  hidden,
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const [tradeDialog, setTradeDialog] = useState(false);

  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const [setting, setSetting] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const amountOut = useMemo(() => {
    if (!limitPrice || !amount || limitPrice === '0') return '';

    return bignumber(amount || '0')
      .div(limitPrice)
      .toString();
  }, [limitPrice, amount]);

  const weiAmount = useWeiAmount(amount);
  const weiAmountOut = useWeiAmount(amountOut);

  const { value: balance } = useAssetBalanceOf(sourceToken);
  const gasLimit = 340000;

  const validate = useMemo(() => {
    return (
      amount &&
      limitPrice &&
      bignumber(weiAmountOut).greaterThan(0) &&
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, sourceToken, gasLimit),
      )
    );
  }, [amount, balance, limitPrice, sourceToken, weiAmount, weiAmountOut]);

  const { createOrder, ...tx } = useLimitOrder(
    sourceToken,
    targetToken,
    weiAmount,
    weiAmountOut,
    duration,
  );

  return (
    <div className={cn({ 'tw-hidden': hidden })}>
      <LimitOrderSetting
        isOpen={setting}
        value={duration}
        onClose={() => setSetting(false)}
        onChange={value => setDuration(value)}
      />
      <TradeDialog
        onCloseModal={() => setTradeDialog(false)}
        isOpen={tradeDialog}
        tradeType={tradeType}
        orderType={OrderTypes.LIMIT}
        amount={amount}
        expectedReturn={stringToFixedPrecision(amountOut, 6)}
        targetToken={targetToken}
        sourceToken={sourceToken}
        limitPrice={limitPrice}
        duration={duration}
        submit={() => createOrder()}
      />

      <TxDialog tx={tx} />
      <div className="tw-mw-340 tw-mx-auto">
        <FormGroup
          label={t(translations.marginTradePage.tradeForm.labels.amount)}
        >
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={sourceToken}
            subElem={
              <div className="tw-mb-2 tw-mt-2">
                <AvailableBalance
                  className={styles['available-balance']}
                  asset={sourceToken}
                />
              </div>
            }
          />
        </FormGroup>

        <FormGroup
          className="tw-mt-8"
          label={t(translations.spotTradingPage.tradeForm.limitPrice)}
        >
          <Input
            value={stringToFixedPrecision(limitPrice, 6)}
            onChange={setLimitPrice}
            type="number"
            appendElem={<AssetRenderer asset={sourceToken} />}
            className="tw-rounded-lg"
          />
        </FormGroup>

        <div
          onClick={() => setSetting(true)}
          className="tw-text-secondary tw-text-xs tw-inline-flex tw-items-center tw-cursor-pointer tw-mb-7"
        >
          {t(translations.spotTradingPage.tradeForm.advancedSettings)}
          <img className="tw-ml-2" alt="setting" src={settingImg} />
        </div>

        <div className="swap-form__amount">
          <div className="tw-text-base tw-mb-1">
            {t(translations.spotTradingPage.tradeForm.amountReceived)}:
          </div>
          <Input
            value={stringToFixedPrecision(amountOut, 6)}
            onChange={() => {}}
            readOnly={true}
            appendElem={<AssetRenderer asset={targetToken} />}
          />
          <div className="tw-invisible swap-btn-helper tw-flex tw-items-center tw-justify-betweenS tw-mt-2">
            <span className="tw-w-full tw-flex tw-items-center tw-justify-between tw-text-xs tw-whitespace-nowrap tw-mr-1">
              <span>{t(translations.swap.minimumReceived)} </span>
              <span>
                {/* {weiToNumberFormat(minReturn, 6)}{' '} */}
                <AssetRenderer asset={targetToken} />
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="tw-mt-12">
        {spotLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.spotTrades}
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
      {!spotLocked && (
        <div className="tw-mw-340 tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mx-auto">
          <Button
            text={t(
              tradeType === TradingTypes.BUY
                ? translations.spotTradingPage.tradeForm.buy_cta
                : translations.spotTradingPage.tradeForm.sell_cta,
            )}
            tradingType={tradeType}
            onClick={() => setTradeDialog(true)}
            disabled={!validate || !connected || spotLocked}
          />
        </div>
      )}
    </div>
  );
};
