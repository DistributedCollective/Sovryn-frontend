import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useGetLoan } from 'app/hooks/trading/useGetLoan';
import { AddCollateralModal } from './AddCollateralModal';
import { selectLendBorrowSovryn } from '../../selectors';
import { actions } from '../../slice';

export const AddCollateralHandler = () => {
  const { addItem, addModalOpen } = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  const { value: loan, loading: loanLoading, getLoan } = useGetLoan();

  useEffect(() => {
    if (addItem) {
      getLoan(addItem);
    }
  }, [addItem, getLoan]);

  const handleClose = useCallback(() => dispatch(actions.closeAddModal()), [
    dispatch,
  ]);

  return (
    <Dialog isOpen={addModalOpen} onClose={handleClose}>
      {loanLoading && <SkeletonRow />}
      {!loanLoading && !!loan && (
        <AddCollateralModal loan={loan} onCloseModal={handleClose} />
      )}
    </Dialog>
  );
};
