import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { ReviewScreen } from './ReviewScreen';
import { StatusScreen } from './StatusScreen';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { toWei } from '../../../../../utils/blockchain/math-helpers';
import { gasLimit } from '../../../../../utils/classifiers';
import {
  TxStatus,
  TxType,
} from '../../../../../store/global/transactions-store/types';
import { NetworkAwareComponentProps } from '../../types';

export const ConfirmationScreens: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const { step, address, amount, set } = useContext(WithdrawContext);

  const { send, ...tx } = useSendContractTx('fastBtcBridge', 'transferToBtc');

  const statusRef = useRef(TxStatus.NONE);

  const handleConfirm = useCallback(() => {
    set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));
    send([address], {
      value: toWei(amount),
      gas: gasLimit[TxType.FAST_BTC_WITHDRAW],
    });
  }, [set, send, address, amount]);

  useEffect(() => {
    if (tx.status !== statusRef.current) {
      statusRef.current = tx.status;

      let newStep: WithdrawStep | undefined;

      switch (tx.status) {
        case TxStatus.PENDING:
        case TxStatus.FAILED:
          newStep = WithdrawStep.PROCESSING;
          break;
        case TxStatus.CONFIRMED:
          newStep = WithdrawStep.COMPLETED;
          break;
      }

      if (newStep) {
        set(prevState => ({ ...prevState, step: newStep as WithdrawStep }));
      }
    }
  }, [tx.status, set]);

  return (
    <>
      {step === WithdrawStep.REVIEW && (
        <ReviewScreen onConfirm={handleConfirm} network={network} />
      )}
      {[
        WithdrawStep.CONFIRM,
        WithdrawStep.PROCESSING,
        WithdrawStep.COMPLETED,
      ].includes(step) && <StatusScreen tx={tx} network={network} />}
    </>
  );
};
