import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { Asset } from '../../../../../types';
import { numberFromWei } from '../../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpatual-pair-dictionary';
import {
  formatAsNumber,
  weiToNumberFormat,
  weiToUSD,
} from '../../../../../utils/display-text/format';
import { Dialog, DialogSize } from '../../../../containers/Dialog';
import { useDollarValue } from '../../../../hooks/useDollarValue';
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
      <div className="tw-w-full tw-max-w-4xl tw-pt-0 tw-pb-12 tw-px-2 sm:tw-px-12 tw-mx-auto">
        <BarCompositionChart
          className="tw-px-8 tw-pt-8 tw-pb-6 tw-bg-gray-3 tw-rounded-xl tw-mt-12"
          totalLabel={t(translations.perpetualPage.accountBalance.total)}
          totalValueLabel={totalLabel}
          entries={chartEntries}
        />
      </div>
    </Dialog>
  );
};
