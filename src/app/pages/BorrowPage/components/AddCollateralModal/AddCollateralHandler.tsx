import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useGetLoan } from 'app/hooks/trading/useGetLoan';
import { AddCollateralModal } from './AddCollateralModal';
import { selectLendBorrowSovryn } from '../../selectors';
import { actions } from '../../slice';
import { useAddCollateralToBorrow } from '../../hooks/useAddCollateralToBorrow';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { Asset } from 'types';
import { ethers } from 'ethers';

export const AddCollateralHandler = () => {
  const { addItem, addModalOpen } = useSelector(selectLendBorrowSovryn);
  const dispatch = useDispatch();

  const { value: loan, loading: loanLoading, getLoan } = useGetLoan();
  const [formData, setFormData] = useState({
    collateral: Asset.RBTC,
    loanId: ethers.constants.HashZero,
    amount: '0',
  });

  useEffect(() => {
    if (addItem) {
      getLoan(addItem);
    }
  }, [addItem, getLoan]);

  const handleClose = useCallback(() => dispatch(actions.closeAddModal()), [
    dispatch,
  ]);

  const { send, ...tx } = useAddCollateralToBorrow();

  const retry = useCallback(
    () => send(formData.collateral, formData.loanId, formData.amount),
    [formData, send],
  );

  const handleSubmit = useCallback(
    (collateral: Asset, loanId: string, amount: string) => {
      setFormData({ collateral, loanId, amount });
      handleClose();
      send(collateral, loanId, amount);
    },
    [handleClose, send],
  );

  return (
    <>
      <Dialog isOpen={addModalOpen} onClose={handleClose}>
        {loanLoading && <SkeletonRow />}
        {!loanLoading && !!loan && (
          <AddCollateralModal
            loan={loan}
            tx={tx}
            onCloseModal={handleClose}
            onSubmit={handleSubmit}
          />
        )}
      </Dialog>
      <TransactionDialog
        tx={{ ...tx, retry }}
        fee={
          <TxFeeCalculator
            args={[loan?.loanId, '1']}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />
        }
      />
    </>
  );
};
