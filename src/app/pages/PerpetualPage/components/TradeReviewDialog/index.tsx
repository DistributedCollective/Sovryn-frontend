import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../../containers/Dialog';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { isPerpetualTrade, PerpetualPageModals } from '../../types';
import { usePerpetual_openTrade } from '../../hooks/usePerpetual_openTrade';

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
        Number(trade?.amount),
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
      {/* TODO: implement Review Trade Dialog */}
      <pre>{JSON.stringify(trade, null, 2)}</pre>
      <button onClick={onSubmit}>Open trade</button>
    </Dialog>
  );
};
