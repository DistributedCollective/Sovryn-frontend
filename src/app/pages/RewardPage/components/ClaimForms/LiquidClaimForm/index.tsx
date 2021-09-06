import React, { useCallback } from 'react';
import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';

export const LiquidClaimForm: React.FC<IClaimFormProps> = ({
  className,
  address,
  amountToClaim,
}) => {
  const { send, ...tx } = useSendContractTx('stakingRewards', 'collectReward');

  const onSubmit = useCallback(() => {
    send(
      [],
      {
        from: address,
      },
      {
        type: TxType.STAKING_REWARDS_CLAIM,
      },
    );
  }, [address, send]);

  return (
    <BaseClaimForm
      className={className}
      amountToClaim={amountToClaim}
      tx={tx}
      onSubmit={onSubmit}
    />
  );
};
