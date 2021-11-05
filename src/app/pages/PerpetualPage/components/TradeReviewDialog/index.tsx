import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { isPerpetualTrade, PerpetualPageModals } from '../../types';
import { usePerpetual_openTrade } from '../../hooks/usePerpetual_openTrade';
import { getTradeDirection } from '../../utils/contractUtils';
import styles from './index.module.scss';
import classNames from 'classnames';

export const TradeReviewDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal, modalOptions } = useSelector(selectPerpetualPage);

  const { trade: openTrade } = usePerpetual_openTrade();

  const trade = useMemo(
    () => (isPerpetualTrade(modalOptions) ? modalOptions : undefined),
    [modalOptions],
  );

  const onClose = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.NONE)),
    [dispatch],
  );

  const onSubmit = useCallback(
    () =>
      trade &&
      openTrade(
        false,
        trade?.amount,
        trade.leverage,
        trade.slippage,
        trade.position,
      ),
    [openTrade, trade],
  );

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.TRADE_REVIEW}
      onClose={onClose}
    >
      <h1>{t(translations.perpetualPage.reviewTrade.title)}</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.importantInfo}>
          <div className={styles.orderAction}>5x Market Buy</div>
          <div className={styles.orderActionAdditionalInfo}>
            0.002 BTC @ ≥ 46415.50 USD
          </div>
        </div>

        <div className={classNames(styles.importantInfo, 'tw-mt-4')}>
          <div className={styles.tradingFeeWrapper}>
            <span className="tw-text-gray-10 tw-font-light">Trading fee:</span>
            <span className="tradingFeeValue">0.0004 BTC</span>
          </div>
        </div>

        <div className={styles.positionDetailsTitle}>New Position Details</div>

        <div className={styles.positionInfo}>
          <div className={styles.positionInfoRow}>
            <span className="tw-text-gray-10 tw-font-light">
              Position Size:
            </span>
            <span>+0.006 BTC</span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10 tw-font-light">Margin:</span>
            <span>0.006 BTC</span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10 tw-font-light">Leverage:</span>
            <span>5x</span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10 tw-font-light">Entry Price:</span>
            <span>≥ 46415.50</span>
          </div>

          <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
            <span className="tw-text-gray-10 tw-font-light">
              Liquidation Price:
            </span>
            <span>91 000 USD</span>
          </div>
        </div>

        <div className="tw-flex tw-justify-center">
          <button className={styles.confirmButton} onClick={onSubmit}>
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
};
