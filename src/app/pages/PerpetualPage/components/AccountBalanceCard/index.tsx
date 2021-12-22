import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { Tooltip } from '@blueprintjs/core';

type AccountBalanceCardProps = {
  /** balance in wei */
  balance: string | null;
};

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({
  balance,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasBalance = useMemo(() => balance && balance !== '0', [balance]);

  const onFundAccount = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.FASTBTC_DEPOSIT)),
    [dispatch],
  );
  const onViewAccount = useCallback(
    () => dispatch(actions.setModal(PerpetualPageModals.ACCOUNT_BALANCE)),
    [dispatch],
  );

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-h-24 tw-p-2.5 tw-bg-gray-4 tw-rounded-lg">
      <div className="tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-justify-between tw-w-full tw-px-3 tw-py-2 tw-bg-gray-6 tw-rounded-lg">
        <span className="tw-text-xs tw-font-medium">
          {t(translations.perpetualPage.accountBalance.availableBalance)}
        </span>
        <span className="tw-block tw-flex-grow tw-text-right">
          {weiToNumberFormat(balance, 4)} BTC
        </span>
      </div>
      {hasBalance ? (
        <button
          className="tw-px-4 tw-py-2 tw-mt-1 tw-text-xs tw-font-medium tw-text-primary"
          onClick={onViewAccount}
        >
          {t(translations.perpetualPage.accountBalance.viewAccount)}
        </button>
      ) : (
        <Tooltip content={t(translations.common.comingSoon)}>
          <button
            className="tw-px-4 tw-py-2 tw-mt-1 tw-text-xs tw-font-medium tw-text-primary tw-cursor-not-allowed tw-opacity-25"
            disabled={true}
            onClick={onFundAccount}
          >
            {t(translations.perpetualPage.accountBalance.fundAccount)}
          </button>
        </Tooltip>
      )}
    </div>
  );
};
