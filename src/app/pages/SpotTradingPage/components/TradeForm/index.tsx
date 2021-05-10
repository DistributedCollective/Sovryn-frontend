import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Select } from 'form/Select';
import { Option } from 'form/Select/types';
import { Text } from '@blueprintjs/core';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';
import { Button } from '../Button';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useWalletContext } from '@sovryn/react-wallet';
import { EngageButton } from '../EngageButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../selectors';
import { actions } from '../../slice';
import { renderItemNH } from 'form/Select/renderers';
import { BuySell } from '../BuySell';
import { SpotPairType, TradingTypes } from '../../types';
import { ArrowDown } from 'app/pages/BuySovPage/components/ArrowStep/down';
import { Input } from 'form/Input';
import settingIcon from '../../../../../assets/images/swap/ic_setting.svg';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { pairs, pairList } from '../../types';
import { useSwapNetwork_rateByPath } from 'app/hooks/swap-network/useSwapNetwork_rateByPath';
import { useSwapNetwork_approveAndConvertByPath } from 'app/hooks/swap-network/useSwapNetwork_approveAndConvertByPath';
import { useSlippage } from 'app/pages/BuySovPage/components/BuyForm/useSlippage';
import { useSwapNetwork_conversionPath } from 'app/hooks/swap-network/useSwapNetwork_conversionPath';
import { Asset } from 'types/asset';
import { SlippageDialog } from 'app/pages/BuySovPage/components/BuyForm/Dialogs/SlippageDialog';
import { maxMinusFee } from 'utils/helpers';
import {
  stringToFixedPrecision,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { AvailableBalance } from 'app/components/AvailableBalance';

export function TradeForm() {
  const { t } = useTranslation();
  const { connected } = useWalletContext();
  const dispatch = useDispatch();

  const [tradeType, setTradeType] = useState(TradingTypes.BUY);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [slippage, setSlippage] = useState(0.5);
  const [amount, setAmount] = useState<string>('');
  const [sourceToken, setSourceToken] = useState(Asset.SOV);
  const [targetToken, setTargetToken] = useState(Asset.RBTC);

  const { pairType } = useSelector(selectSpotTradingPage);

  const weiAmount = useWeiAmount(amount);
  const { value: path } = useSwapNetwork_conversionPath(
    tokenAddress(sourceToken),
    tokenAddress(targetToken),
  );
  const { value: rateByPath } = useSwapNetwork_rateByPath(path, weiAmount);
  const { minReturn } = useSlippage(rateByPath, slippage);
  const { send, ...tx } = useSwapNetwork_approveAndConvertByPath(
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
    setSourceToken(pairs[pairType][tradeType === TradingTypes.BUY ? 1 : 0]);
    setTargetToken(pairs[pairType][tradeType === TradingTypes.BUY ? 0 : 1]);
  }, [pairType, tradeType]);

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
      <div className="tw-trading-form-card spot-form tw-bg-black lg:tw-rounded tw-p-12">
        <div className="tw-mw-320 tw-mx-auto">
          <BuySell value={tradeType} onChange={setTradeType} />

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.pair)}
            className="tw-mt-6"
          >
            <Select
              value={`${pairType}`}
              options={pairList.map(pair => ({
                key: `${pair}`,
                label: `${AssetsDictionary.get(pairs[pair][0]).symbol} - ${
                  AssetsDictionary.get(pairs[pair][1]).symbol
                }`,
              }))}
              filterable={false}
              onChange={value =>
                dispatch(
                  actions.setPairType((value as unknown) as SpotPairType),
                )
              }
              itemRenderer={renderItemNH}
              valueRenderer={(item: Option) => (
                <Text ellipsize className="tw-text-center">
                  {item.label}
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
              value={stringToFixedPrecision(amount, 6)}
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

        {!connected ? (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-4 tw-mt-12">
            <EngageButton />
          </div>
        ) : (
          <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mt-12">
            <Button
              text={t(
                tradeType === TradingTypes.BUY
                  ? translations.spotTradingPage.tradeForm.buy_cta
                  : translations.spotTradingPage.tradeForm.sell_cta,
              )}
              tradingType={tradeType}
              onClick={() => send()}
              disabled={!validate}
            />
          </div>
        )}
      </div>
      <TxDialog tx={tx} />
    </>
  );
}
function tokenAddress(asset: Asset) {
  return AssetsDictionary.get(asset).getTokenContractAddress();
}
