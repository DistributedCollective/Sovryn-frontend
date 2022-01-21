import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
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
import { discordInvite, gasLimit } from 'utils/classifiers';
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

export const ClosePositionDialog = ({
  item,
  showModal,
  onCloseModal,
}: IClosePositionDialogProps) => {
  const receiver = useAccount();

  const sourceToken = AssetsDictionary.getByTokenContractAddress(
    item?.collateralToken || '',
  );
  const targetToken = AssetsDictionary.getByTokenContractAddress(
    item?.loanToken || '',
  );

  const [amount, setAmount] = useState('0');
  const [collateral, setCollateral] = useState(
    assetByTokenAddress(item.collateralToken),
  );
  const [openSlippage, setOpenSlippage] = useState(false);

  useEffect(() => {
    setAmount('0');
  }, [item.collateral]);

  const leverage = leverageFromMargin(item.startMargin);
  const maxAmount = bignumber(item.collateral).div(leverage).toFixed(0);

  const options = useMemo(() => getOptions(item), [item]);
  const isCollateral = useMemo(
    () => collateral === assetByTokenAddress(item.collateralToken),
    [collateral, item.collateralToken],
  );

  const pair = TradingPairDictionary.findPair(
    sourceToken.asset,
    targetToken.asset,
  );

  const weiAmount = useWeiAmount(amount);

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);
  const args = [item.loanId, receiver, weiAmount, isCollateral, '0x'];
  const isLong = targetToken.asset === pair.longAsset;

  const { price: currentPriceSource, loading } = useCurrentPositionPrice(
    sourceToken.asset,
    targetToken.asset,
    weiAmount,
    isLong,
  );

  const { send, ...rest } = useCloseWithSwap(
    item.loanId,
    receiver,
    maxAmount === weiAmount
      ? item.collateral
      : toWei(
          bignumber(amount || '0')
            .mul(leverage)
            .toString(),
        ),
    isCollateral,
    '0x',
  );

  const position =
    pair?.longAsset === item.loanToken
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const entryPrice = useMemo(() => getEntryPrice(item, position), [
    item,
    position,
  ]);

  const [profit] = calculateProfit(
    isLong,
    currentPriceSource,
    entryPrice,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(weiAmount, '1', item.collateral);
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
      <Dialog isOpen={showModal} onClose={onCloseModal}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.pair)}
              value={
                <>
                  <AssetRenderer asset={pair.shortAsset} />/
                  <AssetRenderer asset={pair.longAsset} />
                </>
              }
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.marginType)}
              value={<>{leverage}x</>}
              className={
                targetToken.asset === pair.longAsset
                  ? 'tw-text-trade-long'
                  : 'tw-text-trade-short'
              }
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.positionSize)}
              value={
                <>
                  <LoadableValue
                    loading={false}
                    value={weiToNumberFormat(item.collateral, 4)}
                    tooltip={fromWei(item.collateral)}
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
                      item={item}
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
            onChange={setCollateral}
            options={options}
          />

          <FormGroup
            label={t(translations.closeTradingPositionHandler.amountToClose)}
            className="tw-mt-3"
          >
            <AmountInput
              value={amount}
              onChange={setAmount}
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
              asset={assetByTokenAddress(item.collateralToken)}
              onChange={setSlippage}
            />
          )}

          {weiAmount !== '0' && error && <ErrorBadge content={error} />}

          {closeTradesLocked && (
            <ErrorBadge
              content={
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
              }
            />
          )}
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={send}
            disabled={rest.loading || !valid || closeTradesLocked}
            cancelLabel={t(translations.common.cancel)}
            onCancel={onCloseModal}
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
        onUserConfirmed={onCloseModal}
      />
    </>
  );
};

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

const LabelValuePair = ({ label, value, className }: ILabelValuePairProps) => (
  <div
    className={classNames(
      'tw-flex tw-flex-row tw-mb-1 tw-justify-start tw-text-sov-white',
      className,
    )}
  >
    <div className="tw-w-1/2 tw-text-gray-10 sm:tw-ml-8 sm:tw-pl-2 tw-text-gray-10">
      {label}
    </div>
    <div className="tw-w-1/2 tw-font-medium">{value}</div>
  </div>
);

const getEntryPrice = (item: ActiveLoan, position: TradingPosition) => {
  if (position === TradingPosition.LONG) {
    return Number(weiTo18(item.startRate));
  }
  return 1 / Number(weiTo18(item.startRate));
};
