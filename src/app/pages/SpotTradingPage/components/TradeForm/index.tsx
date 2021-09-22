import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../selectors';
import { BuySell } from '../BuySell';
import { OrderType } from '../OrderType';
import { OrderTypes, pairs, TradingTypes } from '../../types';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { Asset } from 'types/asset';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
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
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from 'app/pages/LandingPage/components/Promotions/components/PromotionCard/types';
import settingImg from 'assets/images/settings-blue.svg';
import styles from './index.module.scss';
import { LimitOrderSetting } from '../LimitOrderSetting';
import { TradeDialog } from '../TradeDialog';

export function TradeForm() {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const { checkMaintenance, States } = useMaintenance();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const [isTradingDialogOpen, setIsTradingDialogOpen] = useState(false);
  const [tradeType, setTradeType] = useState(TradingTypes.BUY);
  const [orderType, setOrderType] = useState(OrderTypes.MARKET);
  const [slippageDialog, setSlippageDialog] = useState<boolean>(false);
  const [slippage, setSlippage] = useState(0.5);
  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [sourceToken, setSourceToken] = useState(Asset.SOV);
  const [targetToken, setTargetToken] = useState(Asset.RBTC);
  const [limitSetting, setLimitSetting] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType] = useState(location.state?.spotTradingPair);

  const { pairType } = useSelector(selectSpotTradingPage);

  const weiAmount = useWeiAmount(amount);

  const { value: rateByPath } = useSwapsExternal_getSwapExpectedReturn(
    sourceToken,
    targetToken,
    weiAmount,
  );
  const { minReturn } = useSlippage(rateByPath, slippage);

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

  useEffect(() => {
    setSourceToken(
      pairs[linkPairType || pairType][tradeType === TradingTypes.BUY ? 1 : 0],
    );
    setTargetToken(
      pairs[linkPairType || pairType][tradeType === TradingTypes.BUY ? 0 : 1],
    );
  }, [linkPairType, pairType, tradeType]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => linkPairType && history.replace(location.pathname), []);

  return (
    <>
      <SlippageDialog
        isOpen={slippageDialog}
        amount={rateByPath}
        value={slippage}
        asset={targetToken}
        onClose={() => setSlippageDialog(false)}
        onChange={value => setSlippage(value)}
      />
      <LimitOrderSetting
        isOpen={limitSetting}
        value={duration}
        onClose={() => setLimitSetting(false)}
        onChange={value => setDuration(value)}
      />
      <TradeDialog
        onCloseModal={() => setIsTradingDialogOpen(false)}
        isOpen={isTradingDialogOpen}
        slippage={slippage}
        tradeType={tradeType}
        orderType={orderType}
        amount={amount}
        minReturn={minReturn}
        targetToken={targetToken}
        sourceToken={sourceToken}
        expectedReturn={rateByPath}
        limitPrice={limitPrice}
        duration={duration}
      />
      <div className="tw-trading-form-card spot-form tw-bg-black tw-rounded-3xl tw-p-12 tw-mx-auto xl:tw-mx-0">
        <div className="tw-mw-340 tw-mx-auto">
          <BuySell value={tradeType} onChange={setTradeType} />
          <OrderType value={orderType} onChange={setOrderType} />
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

          {orderType === OrderTypes.LIMIT && (
            <FormGroup
              className="tw-mt-8"
              label={t(translations.spotTradingPage.tradeForm.limitPrice)}
            >
              <Input
                value={stringToFixedPrecision(limitPrice, 6)}
                onChange={setLimitPrice}
                type="number"
                appendElem={'sats'}
                className="tw-rounded-lg"
              />
            </FormGroup>
          )}

          <div
            onClick={() =>
              orderType === OrderTypes.MARKET
                ? setSlippageDialog(true)
                : setLimitSetting(true)
            }
            className="tw-text-secondary tw-text-xs tw-inline-flex tw-items-center tw-cursor-pointer tw-mb-7"
          >
            {t(translations.spotTradingPage.tradeForm.advancedSettings)}
            <img className="tw-ml-2" alt="setting" src={settingImg} />
          </div>

          {orderType === OrderTypes.MARKET && (
            <div className={styles['market-gap']} />
          )}

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
    </>
  );
}
