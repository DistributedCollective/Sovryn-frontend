import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { bignumber } from 'mathjs';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { DummyField } from 'app/components/DummyField';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useApproveAndAddMargin } from 'app/hooks/trading/useApproveAndAndMargin';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useCanInteract } from 'app/hooks/useCanInteract';
import { useIsAmountWithinLimits } from 'app/hooks/useIsAmountWithinLimits';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite, MAINTENANCE_MARGIN } from 'utils/classifiers';
import { usePositionLiquidationPrice } from 'app/hooks/trading/usePositionLiquidationPrice';
import { toAssetNumberFormat } from 'utils/display-text/format';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { useGetLoan } from 'app/hooks/trading/useGetLoan';
import { toWei } from 'utils/blockchain/math-helpers';
import { AssetValue } from 'app/components/AssetValue';
import { MarginLoansFieldsFragment } from 'utils/graphql/rsk/generated';
import { DEFAULT_TRADE } from '../../types';

interface IAddToMarginDialogProps {
  item: MarginLoansFieldsFragment;
  showModal: boolean;
  onCloseModal: () => void;
}

export const AddToMarginDialog: React.FC<IAddToMarginDialogProps> = ({
  item,
  showModal,
  onCloseModal,
}) => {
  const canInteract = useCanInteract();
  const {
    id,
    trade,
    loanToken: { id: loanTokenId },
    collateralToken: { id: collateralTokenId },
    positionSize: positionSizeItem,
  } = item;
  const entryLeverage = trade?.[0].entryLeverage || DEFAULT_TRADE.entryLeverage;
  const positionSizeValue = positionSizeItem || DEFAULT_TRADE.positionSize;
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    collateralTokenId,
  );
  const loanToken = AssetsDictionary.getByTokenContractAddress(loanTokenId);
  const [amount, setAmount] = useState('');
  const { value: balance } = useAssetBalanceOf(tokenDetails.asset);
  const weiAmount = useWeiAmount(amount);

  const { send, ...tx } = useApproveAndAddMargin(
    tokenDetails.asset,
    id,
    weiAmount,
  );
  const { checkMaintenance, States } = useMaintenance();
  const topupLocked = checkMaintenance(States.ADD_TO_MARGIN_TRADES);

  const leverage = useMemo(() => Number(entryLeverage) + 1, [entryLeverage]);

  const handleConfirm = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);
  const { t } = useTranslation();

  const pair = TradingPairDictionary.findPair(
    loanToken.asset,
    tokenDetails.asset,
  );

  const isLong = useMemo(() => loanToken.asset === pair.longAsset, [
    loanToken.asset,
    pair.longAsset,
  ]);

  const { value: loan, getLoan } = useGetLoan();

  useEffect(() => {
    getLoan(id);
  }, [id, getLoan]);

  const positionSize = useMemo(
    () => bignumber(toWei(positionSizeValue)).add(weiAmount).toString(),
    [positionSizeValue, weiAmount],
  );

  const liquidationPrice = usePositionLiquidationPrice(
    loan ? loan.principal : DEFAULT_TRADE.loanPrincipal,
    positionSize,
    isLong ? TradingPosition.LONG : TradingPosition.SHORT,
    MAINTENANCE_MARGIN,
  );

  return (
    <>
      <Dialog isOpen={showModal} onClose={onCloseModal}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.addToMargin.title)}
          </h1>

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
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
              label={t(translations.marginTradePage.tradeDialog.leverage)}
              value={<>{leverage}x</>}
              className={classNames({
                'tw-text-trade-short': loanToken.asset !== pair.longAsset,
                'tw-text-trade-long': loanToken.asset === pair.longAsset,
              })}
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.positionSize)}
              value={
                <AssetValue
                  asset={tokenDetails.asset}
                  value={toWei(positionSizeValue)}
                  useTooltip
                />
              }
            />
          </div>

          <FormGroup
            label={t(translations.addToMargin.amount)}
            className="tw-mb-6"
          >
            <AmountInput
              onChange={setAmount}
              value={amount}
              asset={tokenDetails.asset}
              showBalance={true}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.addToMargin.liquidationPrice)}
            className="tw-mb-5"
          >
            <DummyField>
              {toAssetNumberFormat(liquidationPrice, pair.longDetails.asset)}{' '}
              <AssetRenderer asset={pair.longDetails.asset} />
            </DummyField>
          </FormGroup>

          <div className="tw-text-sm tw-mb-3">
            <TxFeeCalculator
              args={[id, weiAmount]}
              methodName="depositCollateral"
              contractName="sovrynProtocol"
            />
          </div>

          {topupLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.addToMarginTrades}
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
            onConfirm={handleConfirm}
            disabled={topupLocked || tx.loading || !valid || !canInteract}
          />
        </div>
      </Dialog>
      <TransactionDialog
        fee={
          <TxFeeCalculator
            args={[id, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />
        }
        tx={tx}
        onUserConfirmed={onCloseModal}
      />
    </>
  );
};
