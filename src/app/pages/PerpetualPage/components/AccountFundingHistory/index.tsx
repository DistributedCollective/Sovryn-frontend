import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Pagination } from '../../../../components/Pagination';

type AccountFundingHistoryProps = {
  pairType: PerpetualPairType;
  onOpenTransactionHistory: () => void;
};

export const AccountFundingHistory: React.FC<AccountFundingHistoryProps> = ({
  pairType,
  onOpenTransactionHistory,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="tw-w-full tw-max-w-4xl tw-px-2 sm:tw-px-12 tw-mx-auto">
      {/* <Pagination  /> */}
    </div>
  );
};
