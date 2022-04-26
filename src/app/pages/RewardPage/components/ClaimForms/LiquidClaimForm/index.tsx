import React, { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { gasLimit } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';

export const LiquidClaimForm: React.FC<IClaimFormProps> = ({
  className,
  amountToClaim,
  lastWithdrawalInterval,
}) => {
  const address = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const claimLiquidSovLocked = checkMaintenance(States.CLAIM_LIQUID_SOV);
  const { send, ...tx } = useSendContractTx('stakingRewards', 'collectReward');

  const onSubmit = useCallback(() => {
    send(
      [lastWithdrawalInterval],
      {
        from: address,
        gas: gasLimit[TxType.STAKING_LIQUID_SOV_CLAIM],
      },
      {
        type: TxType.STAKING_LIQUID_SOV_CLAIM,
      },
    );
  }, [address, lastWithdrawalInterval, send]);

  return (
    <BaseClaimForm
      className={className}
      amountToClaim={amountToClaim}
      tx={tx}
      onSubmit={onSubmit}
      footer={<Footer />}
      claimLocked={claimLiquidSovLocked}
    />
  );
};

const Footer: React.FC = () => (
  <>
    <Trans i18nKey={translations.rewardPage.liquidClaimForm.note} />{' '}
    <a
      href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
      target="_blank"
      rel="noreferrer noopener"
      className="tw-text-secondary tw-underline"
    >
      <Trans i18nKey={translations.rewardPage.liquidClaimForm.learn} />
    </a>
  </>
);
