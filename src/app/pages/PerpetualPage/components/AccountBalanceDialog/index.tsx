import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { numberFromWei } from '../../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { Dialog, DialogSize } from '../../../../containers/Dialog';
import { usePerpetual_accountBalance } from '../../hooks/usePerpetual_accountBalance';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { BarCompositionChart } from '../BarCompositionChart';

type IAccountBalanceDialogProps = {
  pairType: PerpetualPairType;
};

export const AccountBalanceDialog: React.FC<IAccountBalanceDialogProps> = ({
  pairType,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modal } = useSelector(selectPerpetualPage);

  const onClose = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.NONE));
  }, [dispatch]);

  const onOpenTransactionHistory = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.ACCOUNT_HISTORY));
  }, [dispatch]);

  const onOpenDeposit = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_DEPOSIT));
  }, [dispatch]);

  const onOpenWithdraw = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_WITHDRAW));
  }, [dispatch]);

  const onOpenTransfer = useCallback(() => {
    dispatch(actions.setModal(PerpetualPageModals.FASTBTC_TRANSFER));
  }, [dispatch]);

  const {
    total,
    available,
    inPositions,
    unrealized,
  } = usePerpetual_accountBalance(pairType);

  const chartEntries = useMemo(
    () => [
      {
        key: 'available',
        value: numberFromWei(available),
        valueLabel: `${weiToNumberFormat(available, 8)} BTC`,
        label: t(translations.perpetualPage.accountBalance.availableBalance),
        color: '#D16F44',
      },
      {
        key: 'inPositions',
        value: numberFromWei(inPositions),
        valueLabel: `${weiToNumberFormat(inPositions, 4)} BTC`,
        label: t(translations.perpetualPage.accountBalance.inPositions),
        color: '#006FFF',
      },
      {
        key: 'unrealized',
        value: numberFromWei(unrealized),
        valueLabel: `${weiToNumberFormat(unrealized, 8)} BTC`,
        label: t(translations.perpetualPage.accountBalance.unrealized),
        colorClassName: 'tw-bg-sov-white',
      },
    ],
    [t, available, inPositions, unrealized],
  );

  // TODO: implement useDollarValue for BTC
  const totalUsd = 'USD not Implemented';
  const totalLabel = useMemo(
    () => (
      <div className="tw-flex tw-flex-row tw-items-center">
        <span>{weiToNumberFormat(total, 8)} BTC</span>
        <span className="tw-ml-2 tw-text-xs">≈ {totalUsd}</span>
      </div>
    ),
    [total],
  );

  return (
    <Dialog
      isOpen={modal === PerpetualPageModals.ACCOUNT_BALANCE}
      onClose={onClose}
      size={DialogSize.lg}
    >
      <h1>{t(translations.perpetualPage.accountBalance.title)}</h1>
      <div className="tw-w-full tw-max-w-4xl tw-px-2 sm:tw-px-12 tw-mx-auto">
        <BarCompositionChart
          className="tw-px-8 tw-pt-8 tw-pb-6 tw-bg-gray-3 tw-rounded-xl tw-mt-12"
          totalLabel={t(translations.perpetualPage.accountBalance.total)}
          totalValueLabel={totalLabel}
          entries={chartEntries}
        />
        <div className="tw-mt-2 tw-text-right">
          <button
            className="tw-text-xs tw-font-medium tw-text-secondary tw-underline"
            onClick={onOpenTransactionHistory}
          >
            {t(translations.perpetualPage.accountBalance.viewHistory)}
          </button>
        </div>
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-mx-auto tw-mt-16 tw-space-y-4 md:tw-space-y-0 md:tw-space-x-10">
          <button
            className="tw-min-w-40 tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
            onClick={onOpenDeposit}
          >
            {t(translations.perpetualPage.accountBalance.deposit)}
          </button>
          <button
            className="tw-min-w-40 tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
            onClick={onOpenWithdraw}
          >
            {t(translations.perpetualPage.accountBalance.withdraw)}
          </button>
          <button
            className="tw-min-w-40 tw-min-h-10 tw-p-2 tw-text-base tw-text-primary tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-duration-300 hover:tw-bg-primary-25"
            onClick={onOpenTransfer}
          >
            {t(translations.perpetualPage.accountBalance.transfer)}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
