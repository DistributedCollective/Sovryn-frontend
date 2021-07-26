/**
 *
 * ClosePositionDialog
 *
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { FormGroup } from 'app/components/Form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { TxType } from '../../../../../store/global/transactions-store/types';
import { assetByTokenAddress } from '../../../../../utils/blockchain/contract-helpers';
import { gasLimit } from '../../../../../utils/classifiers';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useCloseWithSwap } from '../../../../hooks/protocol/useCloseWithSwap';
import { useTrading_testRates } from '../../../../hooks/trading/useTrading_testRates';
import { useAccount } from '../../../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { CollateralAssets } from '../CollateralAssets';

import type { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { discordInvite } from 'utils/classifiers';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
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

export function ClosePositionDialog(props: Props) {
  const receiver = useAccount();

  const [amount, setAmount] = useState<string>('');
  const [collateral, setCollateral] = useState(
    assetByTokenAddress(props.item.collateralToken),
  );

  useEffect(() => {
    setAmount('');
  }, [props.item.collateral]);

  const options = useMemo(() => getOptions(props.item), [props.item]);
  const isCollateral = useMemo(
    () => collateral === assetByTokenAddress(props.item.collateralToken),
    [collateral, props.item.collateralToken],
  );

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    weiAmount,
    isCollateral,
    '0x',
  );

  const handleConfirmSwap = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const { t } = useTranslation();
  const test = useTrading_testRates(
    assetByTokenAddress(
      isCollateral ? props.item.loanToken : props.item.collateralToken,
    ),
    assetByTokenAddress(
      isCollateral ? props.item.collateralToken : props.item.loanToken,
    ),
    weiAmount,
  );

  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);

  const args = [props.item.loanId, receiver, weiAmount, isCollateral, '0x'];

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-w-full tw-max-w-xs tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-white tw-text-center tw-tracking-normal">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>

          <CollateralAssets
            label={t(translations.closeTradingPositionHandler.withdrawIn)}
            value={collateral}
            onChange={value => setCollateral(value)}
            options={options}
          />

          <FormGroup
            label={t(translations.closeTradingPositionHandler.amountToClose)}
            className="tw-mt-7"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              maxAmount={props.item.collateral}
            />
          </FormGroup>

          <TxFeeCalculator
            args={args}
            methodName="closeWithSwap"
            contractName="sovrynProtocol"
            txConfig={{ gas: gasLimit[TxType.CLOSE_WITH_SWAP] }}
          />

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
                        className="tw-text-Red tw-text-xs tw-underline hover:tw-no-underline"
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
            onConfirm={() => handleConfirmSwap()}
            disabled={
              rest.loading || !valid || closeTradesLocked || test.diff > 5
            }
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
