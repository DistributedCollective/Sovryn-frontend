import React, { useCallback } from 'react';
import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

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
      footer={<Footer />}
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
