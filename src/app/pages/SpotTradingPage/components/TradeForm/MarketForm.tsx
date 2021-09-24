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
import { OrderTypes, TradingTypes, ITradeFormProps } from '../../types';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { Asset } from 'types/asset';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { maxMinusFee } from 'utils/helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_getSwapExpectedReturn } from '../../../../hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import settingImg from 'assets/images/settings-blue.svg';
import styles from './index.module.scss';
import { tokenAddress, TradeDialog } from '../TradeDialog';
import { useAccount } from 'app/hooks/useAccount';
import { useSwapsExternal_approveAndSwapExternal } from '../../../../hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { useSwapNetwork_approveAndConvertByPath } from '../../../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import cn from 'classnames';

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

  const [slippageDialog, setSlippageDialog] = useState<boolean>(false);
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

  return (
    <div className={cn({ 'tw-hidden': hidden })}>
      <SlippageDialog
        isOpen={slippageDialog}
        amount={rateByPath}
        value={slippage}
        asset={targetToken}
        onClose={() => setSlippageDialog(false)}
        onChange={value => setSlippage(value)}
      />
      <TradeDialog
        onCloseModal={() => setIsTradingDialogOpen(false)}
        isOpen={isTradingDialogOpen}
        slippage={slippage}
        tradeType={tradeType}
        orderType={OrderTypes.MARKET}
        amount={amount}
        minReturn={minReturn}
        targetToken={targetToken}
        sourceToken={sourceToken}
        expectedReturn={weiToFixed(rateByPath, 6)}
        submit={() => send()}
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

        <div
          onClick={() => setSlippageDialog(true)}
          className="tw-text-secondary tw-text-xs tw-inline-flex tw-items-center tw-cursor-pointer tw-mb-7"
        >
          {t(translations.spotTradingPage.tradeForm.advancedSettings)}
          <img className="tw-ml-2" alt="setting" src={settingImg} />
        </div>

        <div className={styles['market-gap']} />

        <div className="swap-form__amount">
          <div className="tw-text-base tw-mb-1">
            {t(translations.spotTradingPage.tradeForm.amountReceived)}:
          </div>
          <Input
            value={weiToFixed(rateByPath, 6)}
            onChange={value => setAmount(value)}
            readOnly={true}
            appendElem={<AssetRenderer asset={targetToken} />}
          />
          <div className="swap-btn-helper tw-flex tw-items-center tw-justify-betweenS tw-mt-2">
            <span className="tw-w-full tw-flex tw-items-center tw-justify-between tw-text-xs tw-whitespace-nowrap tw-mr-1">
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
        <div className="tw-mw-340 tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mx-auto">
          <Button
            text={t(
              tradeType === TradingTypes.BUY
                ? translations.spotTradingPage.tradeForm.buy_cta
                : translations.spotTradingPage.tradeForm.sell_cta,
            )}
            tradingType={tradeType}
            onClick={() => setIsTradingDialogOpen(true)}
            disabled={!validate || !connected || spotLocked}
          />
        </div>
      )}
    </div>
  );
};
