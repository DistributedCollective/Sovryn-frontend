import React, { useMemo, useState, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { TradingTypes, ITradeFormProps } from '../../types';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { Asset } from 'types/asset';
import { maxMinusFee } from 'utils/helpers';
import {
  stringToFixedPrecision,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from '../../../../hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import styles from './index.module.scss';
import { OrderLabel, tokenAddress, TradeDialog } from '../TradeDialog';
import { useAccount } from 'app/hooks/useAccount';
import { useSwapsExternal_approveAndSwapExternal } from '../../../../hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { useSwapNetwork_approveAndConvertByPath } from '../../../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import cn from 'classnames';
import { Slider } from 'app/components/Form/Slider';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Toast } from 'app/components/Toast';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'web3-utils';
import { OrderView } from './OrderView';

export const MarketForm: React.FC<ITradeFormProps> = ({
  sourceToken,
  targetToken,
  tradeType,
  hidden,
}) => {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const account = useAccount();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const [isTradingDialogOpen, setIsTradingDialogOpen] = useState<boolean>(
    false,
  );
  const [slippage, setSlippage] = useState(0.5);
  const [amount, setAmount] = useState<string>('');

  const weiAmount = useWeiAmount(amount);

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    weiAmount,
  );
  const { minReturn } = useSlippage(rateByPath, slippage);
  const {
    send: sendExternal,
    ...txExternal
  } = useSwapsExternal_approveAndSwapExternal(
    sourceToken,
    targetToken,
    account,
    account,
    weiAmount,
    '0',
    minReturn,
    '0x',
  );

  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(sourceToken),
    tokenAddress(targetToken),
  );

  const { send: sendPath, ...txPath } = useSwapNetwork_approveAndConvertByPath(
    path,
    weiAmount,
    minReturn,
  );

  const { value: balance } = useAssetBalanceOf(sourceToken);
  const gasLimit = 340000;

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(minReturn).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(balance, sourceToken, gasLimit),
      )
    );
  }, [balance, minReturn, sourceToken, weiAmount]);

  const tx = useMemo(() => (targetToken === Asset.RBTC ? txPath : txExternal), [
    targetToken,
    txExternal,
    txPath,
  ]);

  const send = useCallback(
    () => (targetToken === Asset.RBTC ? sendPath() : sendExternal()),
    [targetToken, sendPath, sendExternal],
  );
  const showToast = useCallback(
    (status: string) => {
      Toast(
        status,
        <div className="tw-flex tw-items-center">
          <p className="tw-mb-0 tw-mr-2">
            <Trans
              i18nKey={
                status === 'success'
                  ? translations.transactionDialog.txStatus.complete
                  : translations.transactionDialog.pendingUser.failed
              }
            />
          </p>
          <OrderLabel
            className="tw-ml-2 tw-font-normal"
            orderType={OrderType.MARKET}
            tradeType={tradeType}
          />
          <div className="tw-ml-2">
            {stringToFixedPrecision(amount, 6)}{' '}
            <AssetRenderer asset={sourceToken} />
          </div>
        </div>,
      );
    },
    [amount, sourceToken, tradeType],
  );

  return (
    <div className={cn({ 'tw-hidden': hidden })}>
      <TradeDialog
        onCloseModal={() => setIsTradingDialogOpen(false)}
        isOpen={isTradingDialogOpen}
        slippage={slippage}
        tradeType={tradeType}
        orderType={OrderType.MARKET}
        amount={amount}
        minReturn={minReturn}
        targetToken={targetToken}
        sourceToken={sourceToken}
        expectedReturn={weiToFixed(rateByPath, 6)}
        submit={send}
        fee={
          <TxFeeCalculator
            args={[
              getTokenContract(sourceToken).address,
              getTokenContract(targetToken).address,
              toWei(amount || '0'),
            ]}
            methodName="getSwapExpectedReturn"
            contractName="sovrynProtocol"
            className="tw-mb-0"
          />
        }
      />
      <TransactionDialog
        tx={{ ...tx, retry: send }}
        onUserConfirmed={() => setIsTradingDialogOpen(false)}
        onSuccess={() => showToast('success')}
        onError={() => showToast('error')}
        action={t(translations.spotTradingPage.tradeDialog.order)}
        fee={
          <TxFeeCalculator
            args={[
              getTokenContract(sourceToken).address,
              getTokenContract(targetToken).address,
              toWei(amount || '0'),
            ]}
            methodName="getSwapExpectedReturn"
            contractName="sovrynProtocol"
          />
        }
        finalMessage={
          <OrderView
            tradeType={tradeType}
            orderType={OrderType.MARKET}
            amount={amount}
            minReturn={minReturn}
            targetToken={targetToken}
            sourceToken={sourceToken}
            expectedReturn={weiToFixed(rateByPath, 6)}
          />
        }
      />

      <div className="tw-mx-auto">
        <div className="tw-mb-2 tw-mt-2 tw-bg-gray-5 tw-py-2 tw-text-center tw-flex tw-items-center tw-justify-center tw-rounded-lg">
          <AvailableBalance
            className={styles['available-balance']}
            asset={sourceToken}
          />
        </div>
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-5">
          <span className={styles.amountLabel + ' tw-mr-4'}>Amount:</span>
          <AmountInput
            value={amount}
            onChange={value => setAmount(value)}
            asset={sourceToken}
            hideAmountSelector
            dataActionId="spot-market-amountInput"
          />
        </div>

        <FormGroup
          className="tw-px-3 tw-mt-8"
          label={t(translations.buySovPage.slippageDialog.tolerance)}
        >
          <Slider
            value={slippage}
            onChange={setSlippage}
            min={0.1}
            max={1}
            stepSize={0.05}
            labelRenderer={value => <>{value}%</>}
            labelValues={[0.1, 0.25, 0.5, 0.75, 1]}
            dataActionId="spot-slider-slippageTolerance"
          />
        </FormGroup>

        <div className={styles['market-gap']} />

        <div className="swap-form__amount">
          <div className="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-2 tw-w-full tw-border tw-border-gray-5 tw-rounded-lg">
            <span>
              {t(translations.spotTradingPage.tradeForm.amountReceived)}
            </span>
            <span>
              {weiToFixed(rateByPath, 6)} <AssetRenderer asset={targetToken} />
            </span>
          </div>

          <div className="swap-btn-helper tw-flex tw-items-center tw-justify-betweenS tw-mt-2">
            <span className="tw-w-full tw-flex tw-items-center tw-justify-between tw-text-xs tw-whitespace-nowrap">
              <span>{t(translations.swap.minimumReceived)} </span>
              <span>
                {weiToNumberFormat(minReturn, 6)}{' '}
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
        <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mx-auto">
          <Button
            text={t(
              tradeType === TradingTypes.BUY
                ? translations.spotTradingPage.tradeForm.buy_cta
                : translations.spotTradingPage.tradeForm.sell_cta,
            )}
            tradingType={tradeType}
            onClick={() => setIsTradingDialogOpen(true)}
            disabled={!validate || !connected || spotLocked}
            data-action-id="spot-market-submit"
          />
        </div>
      )}
    </div>
  );
};
