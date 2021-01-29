import React from 'react';
import classNames from 'classnames';
import { TradingPosition } from '../../../types/trading-position';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TradingPair } from '../../../utils/models/trading-pair';
import { weiToNumberFormat } from '../../../utils/display-text/format';
import { Asset } from '../../../types/asset';
import { PricePrediction } from './PricePrediction';
import { useTrading_resolvePairTokens } from '../../hooks/trading/useTrading_resolvePairTokens';
import styles from './TradeConfirmationDialog.module.css';
import { Classes, Overlay } from '@blueprintjs/core';

interface Props {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  weiAmount: string;
  position: TradingPosition;
  leverage: number;
  liquidationPrice: string;
  pair: TradingPair;
  collateral: Asset;
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

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose(false)}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div className="custom-dialog font-family-montserrat">
          <div className={styles.container}>
            <button
              type="button"
              className={styles.close}
              onClick={() => props.onClose(false)}
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
              <div className="row">
                <div className="col-6">
                  {t(translations.tradeConfirmationDialog.main.positionSize)}
                </div>
                <div className="col-6">
                  {weiToNumberFormat(props.weiAmount, 8)} {props.collateral}
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  {t(translations.tradeConfirmationDialog.main.positionLeverge)}
                </div>
                <div className="col-6">{props.leverage}x</div>
              </div>
              <div className="row">
                <div className="col-6">
                  {t(
                    translations.tradeConfirmationDialog.main.maintenanceMargin,
                  )}
                </div>
                <div className="col-6">15%</div>
              </div>
              <div className="row">
                <div className="col-6">
                  {t(
                    translations.tradeConfirmationDialog.main
                      .estimatedLiquidationPrice,
                  )}
                </div>
                <div className="col-6">
                  {weiToNumberFormat(props.liquidationPrice, 2)} USD
                </div>
              </div>
            </section>

            <div className={styles.gasNote}>
              {t(translations.tradeConfirmationDialog.main.gasPriceNote)}
            </div>

            <div className={styles.entryPrice}>
              <div>
                {t(
                  translations.tradeConfirmationDialog.main.positionEntryPrice,
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
                'd-flex flex-row align-items-center justify-content-center',
                styles.button,
                props.position === TradingPosition.SHORT
                  ? styles.button_short
                  : styles.button_long,
              )}
              onClick={() => props.onClose(true)}
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
          </div>
        </div>
      </div>
    </Overlay>
  );
}
