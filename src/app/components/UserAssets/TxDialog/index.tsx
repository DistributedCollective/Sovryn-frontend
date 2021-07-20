import React, { useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog';
import { ResetTxResponseInterface } from 'app/hooks/useSendContractTx';
import { TxStatus } from 'store/global/transactions-store/types';
import { detectWeb3Wallet, prettyTx } from 'utils/helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import styles from './dialog.module.css';
import { useWalletContext } from '@sovryn/react-wallet';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ConfirmButton } from 'app/pages/BuySovPage/components/Button/confirm';
import { usePrevious } from 'app/hooks/usePrevious';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { CloseButton } from './styled';
import { Status } from './Status';
import { WalletLogo, getWalletName } from './WalletLogo';
import { Asset } from 'types';
import { Title } from './Title';
import babelfishLogo from 'assets/images/babelfish.svg';

interface ITxDialogProps {
  tx: ResetTxResponseInterface;
  onUserConfirmed?: () => void;
}

export const TxDialog: React.FC<ITxDialogProps> = (props: ITxDialogProps) => {
  const { t } = useTranslation();
  const { address } = useWalletContext();
  const close = () => {
    props.tx && props.tx.reset();
  };
  const confirm = () => {
    props.tx.reset();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wallet = useMemo(() => detectWeb3Wallet(), [address]);

  const oldStatus = usePrevious(props.tx.status);

  const { txData } = props.tx;

  useEffect(() => {
    if (
      oldStatus === TxStatus.PENDING_FOR_USER &&
      props.tx.status === TxStatus.PENDING &&
      props.onUserConfirmed
    ) {
      props.onUserConfirmed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tx.status]);

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.tx.status !== TxStatus.NONE}
      onClose={() => close()}
      className={styles.dialog}
    >
      <CloseButton onClick={() => close()}>
        <span className="sr-only">Close Dialog</span>
      </CloseButton>
      {props.tx.status === TxStatus.PENDING_FOR_USER && (
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
        props.tx.status,
      ) && (
        <>
          <Title txStatus={props.tx.status} />
          <Status txStatus={props.tx.status} />

          <div className="tw-w-80 tw-mx-auto">
            {!!props.tx.txHash && (
              <div className="tw-w-full tw-flex tw-justify-between tw-text-sm tw-font-extralight tw-tracking-normal">
                <div>
                  <div className="tw-mb-3.5">
                    {t(translations.userAssets.convertDialog.txDialog.dateTime)}
                    :
                  </div>
                  <div className="tw-mb-3.5">
                    {t(
                      translations.userAssets.convertDialog.txDialog.amountSent,
                    )}
                    :
                  </div>
                  <div className="tw-mb-3.5">
                    {t(
                      translations.userAssets.convertDialog.txDialog
                        .amountReceived,
                    )}
                    :
                  </div>
                  <div>
                    {t(translations.userAssets.convertDialog.txDialog.hash)}:
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
                    {weiToFixed(txData?.assetAmount, 6)}{' '}
                    <AssetSymbolRenderer asset={Asset.USDT} />
                  </div>

                  <div className="tw-mb-3.5">
                    {weiToFixed(txData?.assetAmount, 6)}{' '}
                    <AssetSymbolRenderer asset={Asset.XUSD} />
                  </div>

                  <div>
                    <LinkToExplorer
                      txHash={props.tx.txHash}
                      text={prettyTx(props.tx.txHash)}
                      className="tw-text-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {!props.tx.txHash && props.tx.status === TxStatus.FAILED && (
              <>
                <p className="tw-text-center">
                  {t(translations.buySovPage.txDialog.txStatus.aborted)}
                </p>
                {wallet === 'ledger' && (
                  <p className="tw-text-center">
                    {t(translations.buySovPage.txDialog.txStatus.abortedLedger)}
                  </p>
                )}
              </>
            )}

            <div className="tw-w-full">
              <ConfirmButton
                onClick={() =>
                  props.tx.status === TxStatus.CONFIRMED ? confirm() : close()
                }
                text={t(translations.common.close)}
                className="tw-font-bold"
              />
            </div>
            <div className="tw-mt-8 tw-flex tw-flex-col">
              <div>
                <img
                  src={babelfishLogo}
                  alt="babelfish"
                  className="tw-mx-auto"
                />
              </div>
              <div className="tw-font-thin tw-text-sm tw-mx-auto tw-mt-1">
                Powered by babelFish
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
};
