import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import cn from 'classnames';
import {
  calculateProfit,
  weiToNumberFormat,
  toNumberFormat,
} from 'utils/display-text/format';
import { DummyInput } from 'app/components/Form/Input';
import {
  toWei,
  weiTo18,
  fromWei,
  weiToFixed,
} from 'utils/blockchain/math-helpers';
import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { leverageFromMargin } from 'utils/blockchain/leverage-from-start-margin';
import { LoadableValue } from 'app/components/LoadableValue';
import { translations } from 'locales/i18n';
import { TxType } from 'store/global/transactions-store/types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useCloseWithSwap } from 'app/hooks/protocol/useCloseWithSwap';
import { useAccount } from 'app/hooks/useAccount';
import { useIsAmountWithinLimits } from 'app/hooks/useIsAmountWithinLimits';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { CollateralAssets } from '../CollateralAssets';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useCurrentPositionPrice } from 'app/hooks/trading/useCurrentPositionPrice';
import type { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useTrading_testRates } from 'app/hooks/trading/useTrading_testRates';
import { discordInvite } from 'utils/classifiers';
import { useSlippage } from '../SlippageForm/useSlippage';
import { SlippageForm } from '../SlippageForm';
import settingIcon from 'assets/images/settings-blue.svg';
import { ActionButton } from 'app/components/Form/ActionButton';
import { bignumber } from 'mathjs';

interface IClosePositionDialogProps {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
  positionSize?: string;
}

const getOptions = (item: ActiveLoan) => {
  if (!item.collateralToken || !item.loanToken) {
    return [];
  }
  return [
    assetByTokenAddress(item.collateralToken),
    assetByTokenAddress(item.loanToken),
  ];
};

export function ClosePositionDialog(props: IClosePositionDialogProps) {
  const receiver = useAccount();
  const [amount, setAmount] = useState<string>('0');
  const [collateral, setCollateral] = useState(
    assetByTokenAddress(props.item.collateralToken),
  );
  const [openSlippage, setOpenSlippage] = useState(false);

  const sourceToken = AssetsDictionary.getByTokenContractAddress(
    props.item?.collateralToken || '',
  );
  const targetToken = AssetsDictionary.getByTokenContractAddress(
    props.item?.loanToken || '',
  );

  useEffect(() => {
    setAmount('0');
  }, [props.item.collateral]);

  const leverage = leverageFromMargin(props.item.startMargin);
  const maxAmount = bignumber(props.item.collateral).div(leverage).toFixed(0);

  const options = useMemo(() => getOptions(props.item), [props.item]);
  const isCollateral = useMemo(
    () => collateral === assetByTokenAddress(props.item.collateralToken),
    [collateral, props.item.collateralToken],
  );

  const pair = TradingPairDictionary.findPair(
    sourceToken.asset,
    targetToken.asset,
  );

  const weiAmount = useWeiAmount(amount);
  const handleConfirm = () => {
    send();
  };

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);
  const args = [props.item.loanId, receiver, weiAmount, isCollateral, '0x'];
  const isLong = targetToken.asset === pair.longAsset;

  function getEntryPrice(item: ActiveLoan) {
    if (isLong) return Number(weiTo18(item.startRate));
    return 1 / Number(weiTo18(item.startRate));
  }

  const { price: currentPriceSource, loading } = useCurrentPositionPrice(
    sourceToken.asset,
    targetToken.asset,
    weiAmount,
    isLong,
  );

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    maxAmount === weiAmount
      ? props.item.collateral
      : toWei(
          bignumber(amount || '0')
            .mul(leverage)
            .toString(),
        ),
    isCollateral,
    '0x',
  );

  const startPriceSource = getEntryPrice(props.item);

  const [profit, diff] = calculateProfit(
    isLong,
    currentPriceSource,
    startPriceSource,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);
  const test = useTrading_testRates(
    assetByTokenAddress(
      isCollateral ? props.item.loanToken : props.item.collateralToken,
    ),
    assetByTokenAddress(
      isCollateral ? props.item.collateralToken : props.item.loanToken,
    ),
    weiAmount,
  );
  const [slippage, setSlippage] = useState(0.5);
  const totalAmount = Number(amount) + Number(fromWei(profit));
  const { minReturn } = useSlippage(toWei(totalAmount), slippage);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.pair)}
              value={pair.chartSymbol}
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.marginType)}
              value={<>{leverage}x</>}
              className={cn({
                'tw-text-trade-short': targetToken.asset !== pair.longAsset,
                'tw-text-trade-long': targetToken.asset === pair.longAsset,
              })}
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.positionSize)}
              value={
                <>
                  <LoadableValue
                    loading={false}
                    value={weiToNumberFormat(props.item.collateral, 4)}
                    tooltip={fromWei(props.item.collateral)}
                  />{' '}
                  <AssetRenderer asset={sourceToken.asset} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.pl)}
              value={
                <LoadableValue
                  loading={loading}
                  value={
                    <span
                      className={
                        diff < 0 ? 'tw-text-trade-short' : 'tw-text-trade-long'
                      }
                    >
                      <div>
                        {diff > 0 && '+'}
                        {weiToNumberFormat(profit, 6)}{' '}
                        <AssetRenderer asset={sourceToken.asset} />
                        {amount !== '0' && (
                          <div>({toNumberFormat(diff * 100, 2)}%)</div>
                        )}
                      </div>
                    </span>
                  }
                />
              }
            />
          </div>

          <CollateralAssets
            label={t(translations.closeTradingPositionHandler.withdrawIn)}
            value={collateral}
            onChange={value => setCollateral(value)}
            options={options}
          />

          <FormGroup
            label={t(translations.closeTradingPositionHandler.amountToClose)}
            className="tw-mt-3"
          >
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={sourceToken.asset}
              maxAmount={maxAmount}
            />
          </FormGroup>

          <div className="tw-my-0 tw-text-secondary tw-text-xs tw-flex">
            <ActionButton
              text={
                <div className="tw-flex">
                  {t(translations.marginTradeForm.fields.slippageSettings)}
                  <img className="tw-ml-1" src={settingIcon} alt="setting" />
                </div>
              }
              onClick={() => setOpenSlippage(true)}
              className="tw-border-none tw-ml-0 tw-p-0 tw-h-auto"
              textClassName="tw-text-xs tw-overflow-visible tw-text-secondary"
            />
          </div>

          <FormGroup
            label={t(translations.closeTradingPositionHandler.amountReceived)}
            className="tw-mt-3"
          >
            <DummyInput
              value={amount}
              appendElem={<AssetRenderer asset={sourceToken.asset} />}
              className="tw-h-10"
            />
            <div className="tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-justify-between tw-mt-1">
              <p>
                {t(translations.closeTradingPositionHandler.minimumReceived)}
              </p>
              <div className="tw-font-semibold">
                <LoadableValue
                  loading={false}
                  value={weiToFixed(minReturn, 6)}
                  tooltip={
                    <>
                      {weiTo18(minReturn)}{' '}
                      <AssetRenderer asset={sourceToken.asset} />
                    </>
                  }
                />{' '}
                <AssetRenderer asset={sourceToken.asset} />
              </div>
            </div>
          </FormGroup>

          <TxFeeCalculator
            args={args}
            methodName="closeWithSwap"
            contractName="sovrynProtocol"
            txConfig={{ gas: gasLimit[TxType.CLOSE_WITH_SWAP] }}
          />

          {openSlippage && (
            <SlippageForm
              onClose={() => setOpenSlippage(false)}
              amount={toWei(totalAmount)}
              value={slippage}
              asset={assetByTokenAddress(props.item.collateralToken)}
              onChange={value => setSlippage(value)}
            />
          )}

          {(closeTradesLocked || test.diff > 5) && (
            <ErrorBadge
              content={
                closeTradesLocked ? (
                  <Trans
                    i18nKey={translations.maintenance.closeMarginTrades}
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
                ) : test.diff > 5 ? (
                  <>
                    <p className="tw-mb-1">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_1,
                      )}
                    </p>
                    <p className="tw-mb-0">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_2,
                      )}
                    </p>
                  </>
                ) : undefined
              }
            />
          )}
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirm()}
            disabled={rest.loading || !valid || closeTradesLocked}
            cancelLabel={t(translations.common.cancel)}
            onCancel={props.onCloseModal}
          />
        </div>
      </Dialog>
      <TxDialog tx={rest} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}

ClosePositionDialog.defaultProps = {
  item: {
    collateral: '0',
  },
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
        'tw-flex tw-flex-row tw-mb-1 tw-justify-start tw-text-sov-white',
        props.className,
      )}
    >
      <div className="tw-w-1/2 tw-text-gray-10 sm:tw-ml-8 sm:tw-pl-2 tw-text-gray-10">
        {props.label}
      </div>
      <div className="tw-w-1/2 tw-font-medium">{props.value}</div>
    </div>
  );
}
