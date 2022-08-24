import React, { useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { translations } from '../../../../../locales/i18n';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { actions } from '../../slice';
import { PerpetualPageModals } from '../../types';
import { selectPerpetualPage } from '../../selectors';
import { getCollateralName } from '../../utils/renderUtils';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { usePerpetual_getCurrentPairId } from '../../hooks/usePerpetual_getCurrentPairId';

export const AccountBalanceCard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { availableBalance } = perpetuals[currentPairId];

  const { collateral } = useSelector(selectPerpetualPage);
  const collateralAsset = useMemo(() => getCollateralName(collateral), [
    collateral,
  ]);

  const hasBalance = useMemo(() => availableBalance !== '0', [
    availableBalance,
  ]);

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
          {weiToNumberFormat(availableBalance, 4)} {collateralAsset}
        </span>
      </div>
      <button
        className="tw-px-4 tw-py-2 tw-mt-1 tw-text-xs tw-font-medium tw-text-primary"
        onClick={onViewAccount}
        data-action-id={`perps-accountBalance-${hasBalance ? 'view' : 'fund'}`}
      >
        {hasBalance
          ? t(translations.perpetualPage.accountBalance.viewAccount)
          : t(translations.perpetualPage.accountBalance.fundAccount)}
      </button>
    </div>
  );
};
