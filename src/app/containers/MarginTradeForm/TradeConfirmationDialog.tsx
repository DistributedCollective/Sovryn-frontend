// @ts-nocheck
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { TradingPosition } from '../../../types/trading-position';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TradingPair } from '../../../utils/models/trading-pair';
import { weiToNumberFormat } from '../../../utils/display-text/format';
import { Asset } from '../../../types/asset';
import { PricePrediction } from './PricePrediction';
import { useTrading_resolvePairTokens } from '../../hooks/trading/useTrading_resolvePairTokens';
import styles from './TradeConfirmationDialog.module.scss';
import { Classes, Icon, Overlay } from '@blueprintjs/core';
import {
  ResetTxResponseInterface,
  SendTxResponse,
} from '../../hooks/useSendContractTx';
import { TxStatus } from '../../../store/global/transactions-store/types';
import { LinkToExplorer } from '../../components/LinkToExplorer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  weiAmount: string;
  position: TradingPosition;
  leverage: number;
  liquidationPrice: string;
  pair: TradingPair;
  collateral: Asset;
  tx: ResetTxResponseInterface;
}

interface Props2 {
  tx: SendTxResponse;
  onClose: () => void;
}

function CloseButton({
  onClose,
  title,
}: {
  onClose: () => void;
  title: string;
}) {
  return (
    <button
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-justify-center',
        styles.button,
      )}
      onClick={() => onClose()}
    >
      <span>{title}</span>
    </button>
  );
}

function TxStatusRenderer({ tx, onClose }: Props2) {
  const { t } = useTranslation();
  switch (tx.status) {
    default:
      return (
        <>
          <CloseButton
            onClose={onClose}
            title={t(translations.tradeConfirmationDialog.main.closeBtn)}
          />
        </>
      );
    case TxStatus.PENDING_FOR_USER:
      return (
        <>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-mb-12 tw-px-6">
            <div className="tw-mr-4">
              <Icon icon="time" iconSize={27} />
            </div>
            <div>
              <div className={styles.txTitle}>
                {t(translations.sendTxProgress.pending_for_user.title)}
              </div>
              <div className={styles.txText}>
                {t(translations.sendTxProgress.pending_for_user.text)}
              </div>
              <div className="tw-font-bold tw-text-center tw-mt-6">
                {t(translations.tradeConfirmationDialog.main.gasPriceNote)}
              </div>
            </div>
          </div>
          <CloseButton
            onClose={onClose}
            title={t(translations.tradeConfirmationDialog.main.closeBtn)}
          />
        </>
      );
    case TxStatus.PENDING:
      return (
        <>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-mb-12 tw-px-6">
            <div className="tw-mr-4">
              <Icon icon="time" iconSize={27} />
            </div>
            <div>
              <div className={styles.txTitle}>
                {t(translations.sendTxProgress.pending.title)}
              </div>
              <div className={styles.txText}>
                {t(translations.sendTxProgress.pending.text)}
              </div>
              {tx.txHash && (
                <div className={classNames(styles.txHash, 'tw-text-center')}>
                  <LinkToExplorer txHash={tx.txHash} />
                </div>
              )}
            </div>
          </div>
          <CloseButton
            onClose={onClose}
            title={t(translations.tradeConfirmationDialog.main.closeBtn)}
          />
        </>
      );
    case TxStatus.CONFIRMED:
      return (
        <>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-mb-12 tw-px-6">
            <div className="tw-mr-4">
              <Icon
                icon="tick"
                iconSize={27}
                style={{ color: `var(--teal)` }}
              />
            </div>
            <div>
              <div className={styles.txTitle}>
                {t(translations.sendTxProgress.confirmed.title)}
              </div>
              <div className={styles.txText}>
                {t(translations.sendTxProgress.confirmed.text)}
              </div>
              {tx.txHash && (
                <div className={classNames(styles.txHash, 'tw-text-center')}>
                  <LinkToExplorer txHash={tx.txHash} />
                </div>
              )}
            </div>
          </div>
          <CloseButton
            onClose={onClose}
            title={t(translations.tradeConfirmationDialog.main.closeBtn)}
          />
        </>
      );
    case TxStatus.FAILED:
      return (
        <>
          <div className="tw-flex tw-flex-col tw-justify-start tw-items-center tw-mb-12 tw-px-6">
            <div className="tw-mr-4">
              <Icon
                icon="error"
                iconSize={27}
                style={{ color: `var(--Muted_red)` }}
              />
            </div>
            <div>
              <div className={styles.txTitle}>
                {t(
                  translations.sendTxProgress[tx.txHash ? 'failed' : 'denied']
                    .title,
                )}
              </div>
              <div className={styles.txText}>
                {t(
                  translations.sendTxProgress[tx.txHash ? 'failed' : 'denied']
                    .text,
                )}
              </div>
              {tx.txHash && (
                <div className={classNames(styles.txHash, 'tw-text-center')}>
                  <LinkToExplorer txHash={tx.txHash} />
                </div>
              )}
            </div>
          </div>
          <CloseButton
            onClose={onClose}
            title={t(translations.tradeConfirmationDialog.main.closeBtn)}
          />
        </>
      );
  }
}

export function TradeConfirmationDialog(props: Props) {
  const { t } = useTranslation();

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(
    props.pair,
    props.position,
    props.pair.getAssetForPosition(props.position),
    props.collateral,
  );

  const closing = useCallback(() => {
    props.tx.reset();
  }, [props]);

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      onClosing={closing}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div className="custom-dialog">
          <div className={styles.container}>
            <button
              type="button"
              className={styles.close}
              onClick={() => props.onClose()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
              >
                <path
                  id="Path_2939"
                  data-name="Path 2939"
                  d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z"
                  transform="translate(-5 -5)"
                  fill="#d9d9d9"
                />
              </svg>
            </button>
            <h2 className={styles.title}>
              {props.leverage}x{' '}
              {t(
                translations.tradeConfirmationDialog.positions[
                  props.position.toLowerCase()
                ],
              )}{' '}
              {props.pair.getAsset()}
            </h2>

            <section className={styles.summary}>
              <div className="tw-grid tw-gap-8 tw-grid-cols-12">
                <div className="tw-col-span-6">
                  {t(translations.tradeConfirmationDialog.main.positionSize)}
                </div>
                <div className="tw-col-span-6">
                  {weiToNumberFormat(props.weiAmount, 8)} {props.collateral}
                </div>
              </div>
              <div className="tw-grid tw-gap-8 tw-grid-cols-12">
                <div className="tw-col-span-6">
                  {t(translations.tradeConfirmationDialog.main.positionLeverge)}
                </div>
                <div className="tw-col-span-6">{props.leverage}x</div>
              </div>
              <div className="tw-grid tw-gap-8 tw-grid-cols-12">
                <div className="tw-col-span-6">
                  {t(
                    translations.tradeConfirmationDialog.main.maintenanceMargin,
                  )}
                </div>
                <div className="tw-col-span-6">15%</div>
              </div>
              <div className="tw-grid tw-gap-8 tw-grid-cols-12">
                <div className="tw-col-span-6">
                  {t(
                    translations.tradeConfirmationDialog.main
                      .estimatedLiquidationPrice,
                  )}
                </div>
                <div className="tw-col-span-6">
                  {weiToNumberFormat(props.liquidationPrice, 2)} USD
                </div>
              </div>
            </section>

            {props.tx.status === TxStatus.NONE ? (
              <>
                <div className={styles.gasNote}>
                  {t(translations.tradeConfirmationDialog.main.gasPriceNote)}
                </div>
                <div className={styles.entryPrice}>
                  <div>
                    {t(
                      translations.tradeConfirmationDialog.main
                        .positionEntryPrice,
                    )}
                  </div>
                  <div className={styles.entryPrice__value}>
                    <PricePrediction
                      position={props.position}
                      leverage={props.leverage}
                      loanToken={loanToken}
                      collateralToken={collateralToken}
                      useLoanTokens={useLoanTokens}
                      weiAmount={props.weiAmount}
                    />
                  </div>
                </div>

                <div className={styles.entryPriceNote}>
                  {t(translations.tradeConfirmationDialog.main.entryPriceNote)}
                </div>

                <button
                  className={classNames(
                    'tw-flex tw-flex-row tw-items-center tw-justify-center',
                    styles.button,
                    props.position === TradingPosition.SHORT
                      ? styles.button_short
                      : styles.button_long,
                  )}
                  onClick={() => props.onConfirm()}
                >
                  <span>
                    {t(
                      translations.tradeConfirmationDialog.main[
                        props.position === TradingPosition.SHORT
                          ? 'tradeButtonShort'
                          : 'tradeButtonLong'
                      ],
                    )}
                  </span>
                </button>
              </>
            ) : (
              <div className="tw-mt-12">
                <TxStatusRenderer
                  tx={props.tx}
                  onClose={() => props.onClose()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
