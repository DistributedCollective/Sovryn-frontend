import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from 'app/components/Form/Select';
import { Option } from 'app/components/Form/Select/types';
import { Text } from '@blueprintjs/core';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../selectors';
import { actions } from '../../slice';
import { renderAssetPair } from 'app/components/Form/Select/renderers';
import { BuySell } from '../BuySell';
import {
  getAmmSpotPairs,
  pairs,
  SpotPairType,
  TradingTypes,
} from '../../types';
import { ArrowDown } from 'app/pages/BuySovPage/components/ArrowStep/down';
import { Input } from 'app/components/Form/Input';
import settingIcon from '../../../../../assets/images/swap/ic_setting.svg';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { Asset } from 'types/asset';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { maxMinusFee } from 'utils/helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { AvailableBalance } from 'app/components/AvailableBalance';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useSwapsExternal_approveAndSwapExternal } from '../../../../hooks/swap-network/useSwapsExternal_approveAndSwapExternal';
import { useAccount } from '../../../../hooks/useAccount';
import { useSwapsExternal_getSwapExpectedReturn } from '../../../../hooks/swap-network/useSwapsExternal_getSwapExpectedReturn';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from 'app/pages/LandingPage/components/Promotions/components/PromotionCard/types';
import { useSwapNetwork_conversionPath } from '../../../../hooks/swap-network/useSwapNetwork_conversionPath';
import { useSwapNetwork_approveAndConvertByPath } from '../../../../hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { noop } from 'app/constants';

export function TradeForm() {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const dispatch = useDispatch();
  const { checkMaintenance, States } = useMaintenance();
  const account = useAccount();
  const spotLocked = checkMaintenance(States.SPOT_TRADES);

  const [tradeType, setTradeType] = useState(TradingTypes.BUY);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [slippage, setSlippage] = useState(0.5);
  const [amount, setAmount] = useState<string>('');
  const [sourceToken, setSourceToken] = useState(Asset.SOV);
  const [targetToken, setTargetToken] = useState(Asset.RBTC);

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

  const tx = useMemo(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? txPath
        : txExternal,
    [targetToken, sourceToken, txExternal, txPath],
  );

  const send = useCallback(
    () =>
      targetToken === Asset.RBTC ||
      [targetToken, sourceToken].includes(Asset.RIF)
        ? sendPath()
        : sendExternal(),
    [targetToken, sourceToken, sendPath, sendExternal],
  );

  return (
    <>
      {dialogOpen && (
        <SlippageDialog
          isOpen={dialogOpen}
          amount={rateByPath}
          value={slippage}
          asset={targetToken}
          onClose={() => setDialogOpen(false)}
          onChange={value => setSlippage(value)}
        />
      )}
      <div className="tw-trading-form-card spot-form tw-bg-black tw-rounded-3xl tw-p-12 tw-mx-auto xl:tw-mx-0">
        <div className="tw-mw-340 tw-mx-auto">
          <BuySell value={tradeType} onChange={setTradeType} />

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.pair)}
            className="tw-mt-6"
          >
            <Select
              value={`${linkPairType || pairType}`}
              options={getAmmSpotPairs().map(pair => ({
                key: `${pair}`,
                label: pairs[pair],
              }))}
              onChange={value =>
                dispatch(
                  actions.setPairType((value as unknown) as SpotPairType),
                )
              }
              filterable={true}
              itemRenderer={renderAssetPair}
              valueRenderer={(item: Option<string, Asset[], any>) => (
                <Text ellipsize className="tw-text-center">
                  <AssetRenderer asset={item.label[0]} /> -{' '}
                  <AssetRenderer asset={item.label[1]} />
                </Text>
              )}
            />
          </FormGroup>
          <div className="tw-mb-6 tw-mt-2">
            <AvailableBalance asset={sourceToken} />
          </div>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken}
            />
          </FormGroup>

          <ArrowDown />

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
              <span className="tw-text-xs tw-whitespace-nowrap tw-mr-1">
                {t(translations.swap.minimumReceived)}{' '}
                {weiToNumberFormat(minReturn, 6)}
              </span>
              <img
                src={settingIcon}
                alt="settings"
                onClick={() => setDialogOpen(true)}
              />
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
              onClick={send}
              disabled={!validate || !connected || spotLocked}
            />
          </div>
        )}
      </div>
      {/* <TxDialog tx={tx} /> */}
      <TransactionDialog
        tx={{ ...tx, retry: send }}
        onUserConfirmed={noop}
        action="Trade"
        finalMessage={
          <div className="tw-text-center tw-w-full">
            {t(translations.spotTradingPage.meta.title)}
          </div>
        }
      />
    </>
  );
}

function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
