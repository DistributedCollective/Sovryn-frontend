import React from 'react';
import { useSelector } from 'react-redux';

import BorrowingContainer from '../../BorrowingContainer';
import { selectLendBorrowSovryn } from '../../selectors';

type Props = {};

const CurrencyDetails: React.FC<Props> = () => {
  const { asset } = useSelector(selectLendBorrowSovryn);

  return (
    <div className="sovryn-tabs tw-border tw-border-white tw-p-4 tw-rounded-lg">
      <BorrowingContainer currency={asset} />
    </div>
  );
};

export default CurrencyDetails;
