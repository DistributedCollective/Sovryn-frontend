import React, { useCallback, useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import styles from './dialog.module.scss';
import { useWalletContext } from '@sovryn/react-wallet';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ConfirmButton } from 'app/pages/BuySovPage/components/Button/confirm';
import { usePrevious } from 'app/hooks/usePrevious';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { StatusComponent } from './StatusComponent';
import { WalletLogo, getWalletName } from './WalletLogo';

interface ITxDialogProps {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
}

export const TxDialog: React.FC<ITxDialogProps> = ({ tx, onUserConfirmed }) => {
  const { t } = useTranslation();
  const { address } = useWalletContext();

  const close = useCallback(() => tx?.reset(), [tx]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(tx.status);

  const { txData } = tx;

  useEffect(() => {
    if (
      oldStatus === TxStatus.PENDING_FOR_USER &&
      tx.status === TxStatus.PENDING &&
      onUserConfirmed
    ) {
      onUserConfirmed();
    }
  }, [tx.status, oldStatus, onUserConfirmed]);

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={tx.status !== TxStatus.NONE}
      onClose={close}
      className={styles.dialog}
    >
      <button className={styles.closeButton}>
        <span className="tw-sr-only">Close Dialog</span>
      </button>
      {tx.status === TxStatus.PENDING_FOR_USER && (
        <>
          <div className="tw-mb-24 tw-normal-case tw-text-center tw-text-2xl tw-font-semibold">
            {t(translations.buySovPage.txDialog.pendingUser.title)}
          </div>
          <WalletLogo wallet={wallet} />
          <p className="tw-text-center tw-mx-auto tw-text-base">
            {t(translations.buySovPage.txDialog.pendingUser.text, {
              walletName: getWalletName(wallet),
            })}
          </p>
        </>
      )}
      {[TxStatus.PENDING, TxStatus.CONFIRMED, TxStatus.FAILED].includes(
        tx.status,
      ) && (
        <>
          <div className="tw-text-2xl tw-font-medium tw-tracking-normal tw-mx-auto">
            {t(translations.buySovPage.txDialog.txStatus.title)}
          </div>
          <StatusComponent status={tx.status} />

          {!!tx.txHash && (
            <div className="tw-w-full tw-flex tw-justify-between tw-text-sm tw-font-extralight tw-tracking-normal">
              <div>
                <div className="tw-mb-3.5">
                  {t(translations.originsLaunchpad.saleDay.txDialog.dateTime)}:
                </div>
                <div className="tw-mb-3.5">
                  {t(translations.originsLaunchpad.saleDay.txDialog.amountSent)}
                  :
                </div>
                <div className="tw-mb-3.5">
                  {t(
                    translations.originsLaunchpad.saleDay.txDialog
                      .amountReceived,
                  )}
                  :
                </div>
                <div className="tw-mb-3.5">
                  {t(translations.originsLaunchpad.saleDay.txDialog.txHash)}:
                </div>
              </div>

              <div>
                <div className="tw-mb-3.5">
                  <DisplayDate
                    timestamp={new Date(txData?.customData?.date)
                      .getTime()
                      .toString()}
                    timezoneLabel="UTC"
                  />
                </div>

                <div className="tw-mb-3.5">
                  {weiToFixed(txData?.customData?.sourceAmount, 6)}{' '}
                  <AssetSymbolRenderer
                    asset={txData?.customData?.sourceToken}
                  />
                </div>

                <div className="tw-mb-3.5">
                  {weiToFixed(txData?.customData?.destinationAmount, 6)}{' '}
                  <AssetSymbolRenderer
                    assetString={txData?.customData?.destinationToken}
                  />
                </div>

                <div className="tw-mb-3.5">
                  <LinkToExplorer
                    txHash={tx.txHash}
                    text={prettyTx(tx.txHash)}
                    className="tw-text-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {!tx.txHash && tx.status === TxStatus.FAILED && (
            <>
              <p className="tw-text-center tw-px-3 tw-text-warning">
                {t(translations.buySovPage.txDialog.txStatus.aborted)}
              </p>
              {wallet === 'ledger' && (
                <p className="tw-text-center tw-px-3 tw-text-warning">
                  {t(translations.buySovPage.txDialog.txStatus.abortedLedger)}
                </p>
              )}
            </>
          )}

          <div className="tw-w-full">
            <ConfirmButton
              onClick={close}
              text={t(translations.common.close)}
              className="tw-font-bold"
            />
          </div>
        </>
      )}
    </Dialog>
  );
};
