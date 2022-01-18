import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { Asset } from 'types/asset';
import { Dialog } from 'app/containers/Dialog';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DummyInput } from 'app/components/Form/Input';
import { DialogButton } from 'app/components/Form/DialogButton';
import { LoadableValue } from 'app/components/LoadableValue';
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
  amountReceived: string;
}
export const ReviewDialog: React.FC<IReviewDialogProps> = props => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const swapDialogLocked = checkMaintenance(States.SWAP_TRADES);

  const onConfirm = useCallback(() => {
    props.onConfirm();
    props.onClose();
  }, [props]);

  return (
    <>
      <Dialog isOpen={props.isOpen} onClose={() => props.onClose()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.swapTradeForm.reviewSwap)}
          </h1>
          <div className="tw-py-4 tw-px-16 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.swapTradeForm.swapAsset)}
              value={<AssetRenderer asset={props.sourceToken} />}
            />
            <LabelValuePair
              label={t(translations.swapTradeForm.amount)}
              value={stringToFixedPrecision(props.amount, 6)}
            />
            <LabelValuePair
              label={t(translations.swapTradeForm.receiveAsset)}
              value={<AssetRenderer asset={props.targetToken} />}
            />
          </div>

          <FormGroup label={t(translations.swapTradeForm.amountReceived)}>
            <DummyInput
              value={<>{weiToFixed(props.amountReceived, 6)}</>}
              appendElem={<AssetRenderer asset={props.targetToken} />}
              className="tw-h-10 tw-truncate"
            />
            <div className="tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-justify-between tw-mt-1">
              <p className="tw-mb-3">
                {t(translations.swapTradeForm.minimumReceived)}
              </p>
              <div className="tw-font-semibold">
                <LoadableValue
                  loading={false}
                  value={weiToFixed(props.amountReceived, 6)}
                />{' '}
                <AssetRenderer asset={props.targetToken} />
              </div>
            </div>
          </FormGroup>

          <TxFeeCalculator
            args={[
              getTokenContract(props.sourceToken).address,
              getTokenContract(props.targetToken).address,
              toWei(props.amount),
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
            onConfirm={onConfirm}
            disabled={swapDialogLocked}
          />
        </div>
      </Dialog>
    </>
  );
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
        'tw-flex tw-flex-row tw-justify-between tw-space-x-4 tw-mb-2',
        props.className,
      )}
    >
      <div className="tw-truncate tw-w-7/12">{props.label}</div>
      <div className="tw-truncate tw-w-5/12 tw-text-left">{props.value}</div>
    </div>
  );
}
