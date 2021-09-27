import React, { useCallback } from 'react';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { getContract } from 'utils/blockchain/contract-helpers';
import { TxType } from 'store/global/transactions-store/types';

export const FeesEarnedClaimForm: React.FC<IClaimFormProps> = ({
  className,
  amountToClaim,
}) => {
  const address = useAccount();
  const { send, ...tx } = useSendContractTx('feeSharingProxy', 'withdraw');

  const onSubmit = useCallback(() => {
    send(
      [getContract('RBTC_lending').address, 1, address],
      { from: address },
      { type: TxType.STAKING_REWARDS_CLAIM },
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
