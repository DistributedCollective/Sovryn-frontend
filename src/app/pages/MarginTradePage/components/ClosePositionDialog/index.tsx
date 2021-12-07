import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { calculateProfit, weiToNumberFormat } from 'utils/display-text/format';
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
import { TransactionDialog } from 'app/components/TransactionDialog';
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
import { useSlippage } from '../SlippageForm/useSlippage';
import { SlippageForm } from '../SlippageForm';
import settingIcon from 'assets/images/settings-blue.svg';
import { ActionButton } from 'app/components/Form/ActionButton';
import { bignumber } from 'mathjs';
import { DummyInput } from 'app/components/Form/Input';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { ProfitContainer } from '../OpenPositionsTable/ProfitContainer';
import { TradingPosition } from 'types/trading-position';
import { MARGIN_SLIPPAGE_DEFAULT } from '../../types';

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

  const position =
    pair?.longAsset === props.item.loanToken
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const entryPrice = useMemo(() => getEntryPrice(props.item, position), [
    props.item,
    position,
  ]);

  const [profit] = calculateProfit(
    isLong,
    currentPriceSource,
    entryPrice,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);
  const [slippage, setSlippage] = useState(MARGIN_SLIPPAGE_DEFAULT);
  const totalAmount = Number(amount) + Number(fromWei(profit));
  const { minReturn } = useSlippage(toWei(totalAmount), slippage);

  const { error } = useCacheCallWithValue<{
    withdrawAmount: string;
    withdrawToken: string;
  }>(
    'sovrynProtocol',
    'closeWithSwap',
    { withdrawAmount: '0', withdrawToken: '' },
    ...args,
  );

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
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
                    <ProfitContainer
                      item={props.item}
                      position={position}
                      entryPrice={entryPrice}
                      leverage={leverage}
                    />
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

          <div className="tw-text-sm tw-mb-3">
            <TxFeeCalculator
              args={args}
              methodName="closeWithSwap"
              contractName="sovrynProtocol"
              txConfig={{ gas: gasLimit[TxType.CLOSE_WITH_SWAP] }}
            />
          </div>

          {openSlippage && (
            <SlippageForm
              onClose={() => setOpenSlippage(false)}
              amount={toWei(totalAmount)}
              value={slippage}
              asset={assetByTokenAddress(props.item.collateralToken)}
              onChange={value => setSlippage(value)}
            />
          )}

          {weiAmount !== '0' && error && <ErrorBadge content={error} />}
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirm()}
            disabled={rest.loading || !valid || closeTradesLocked}
            cancelLabel={t(translations.common.cancel)}
            onCancel={props.onCloseModal}
          />
        </div>
      </Dialog>
      <TransactionDialog
        fee={
          <TxFeeCalculator
            args={args}
            methodName="closeWithSwap"
            contractName="sovrynProtocol"
            txConfig={{ gas: gasLimit[TxType.CLOSE_WITH_SWAP] }}
          />
        }
        tx={rest}
        onUserConfirmed={() => props.onCloseModal()}
      />
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

function getEntryPrice(item: ActiveLoan, position: TradingPosition) {
  if (position === TradingPosition.LONG) return Number(weiTo18(item.startRate));
  return 1 / Number(weiTo18(item.startRate));
}
