import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import { Asset } from 'types/asset';
import { Dialog } from 'app/containers/Dialog';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DummyInput } from 'app/components/Form/Input';
import { DialogButton } from 'app/components/Form/DialogButton';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { toWei, weiToFixed } from 'utils/blockchain/math-helpers';
import { stringToFixedPrecision } from 'utils/display-text/format';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';

interface IReviewDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  sourceToken: Asset;
  targetToken: Asset;
  amount: string;
  expectedReturn: string;
  amountReceived: string;
}
export const ReviewDialog: React.FC<IReviewDialogProps> = ({
  isOpen,
  onConfirm,
  onClose,
  sourceToken,
  targetToken,
  amount,
  expectedReturn,
  amountReceived,
}) => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const swapDialogLocked = checkMaintenance(States.SWAP_TRADES);

  const submit = useCallback(() => {
    onConfirm();
    onClose();
  }, [onClose, onConfirm]);

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.swapTradeForm.reviewSwap)}
          </h1>
          <div className="tw-py-4 tw-px-16 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.swapTradeForm.swapAsset)}
              value={<AssetRenderer asset={sourceToken} />}
            />
            <LabelValuePair
              label={t(translations.swapTradeForm.amount)}
              value={stringToFixedPrecision(amount, 6)}
            />
            <LabelValuePair
              label={t(translations.swapTradeForm.receiveAsset)}
              value={<AssetRenderer asset={targetToken} />}
            />
          </div>

          <FormGroup label={t(translations.swapTradeForm.amountReceived)}>
            <DummyInput
              value={<>{weiToFixed(expectedReturn, 6)}</>}
              appendElem={<AssetRenderer asset={targetToken} />}
              className="tw-h-10 tw-truncate"
            />
            <div className="tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-justify-between tw-mt-1">
              <p className="tw-mb-3">
                {t(translations.swapTradeForm.minimumReceived)}
              </p>
              <div className="tw-font-semibold">
                {weiToFixed(amountReceived, 6)}{' '}
                <AssetRenderer asset={targetToken} />
              </div>
            </div>
          </FormGroup>

          <TxFeeCalculator
            args={[
              getTokenContract(sourceToken).address,
              getTokenContract(targetToken).address,
              toWei(amount),
            ]}
            methodName="getSwapExpectedReturn"
            contractName="sovrynProtocol"
          />

          {swapDialogLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.swapTrades}
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
            onConfirm={submit}
            disabled={swapDialogLocked}
            data-action-id="swap-reviewDialog-confirm"
          />
        </div>
      </Dialog>
    </>
  );
};

interface ILabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

const LabelValuePair: React.FC<ILabelValuePairProps> = ({
  className,
  label,
  value,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-row tw-justify-between tw-space-x-4 tw-mb-2',
      className,
    )}
  >
    <div className="tw-truncate tw-w-7/12">{label}</div>
    <div className="tw-truncate tw-w-5/12 tw-text-left">{value}</div>
  </div>
);
