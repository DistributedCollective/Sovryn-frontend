/**
 *
 * ClosePositionDialog
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '../Dialog/Loadable';
import { selectLendBorrowSovryn } from '../LendBorrowSovryn/selectors';
import { actions } from '../LendBorrowSovryn/slice';
import { useGetLoan } from '../../hooks/trading/useGetLoan';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { RepayPositionForm } from './RepayPositionForm';

interface Props {}

export function RepayPositionHandler(props: Props) {
  const { repayItem, repayModalOpen } = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  const { value: loan, loading: loanLoading, getLoan } = useGetLoan();

  useEffect(() => {
    if (repayItem) {
      getLoan(repayItem);
    }
  }, [repayItem, getLoan]);

  return (
    <Dialog
      isOpen={repayModalOpen}
      onClose={() => dispatch(actions.closeRepayModal())}
    >
      {loanLoading && <SkeletonRow />}
      {!loanLoading && !!loan && <RepayPositionForm loan={loan} />}
    </Dialog>
  );
}
