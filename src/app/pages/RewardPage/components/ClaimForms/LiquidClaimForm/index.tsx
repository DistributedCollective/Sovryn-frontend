import React, { useCallback } from 'react';
import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';

export const LiquidClaimForm: React.FC<IClaimFormProps> = ({
  className,
  amountToClaim,
}) => {
  const address = useAccount();
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
