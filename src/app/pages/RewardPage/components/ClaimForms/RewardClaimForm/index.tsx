import React from 'react';
import { Trans } from 'react-i18next';

import { translations } from 'locales/i18n';
import { useClaimRewardSov } from './hooks/useClaimRewardSov';
import { BaseClaimForm } from '../BaseClaimForm';
import { IRewardClaimFormProps } from '../BaseClaimForm/types';
import { useMaintenance } from 'app/hooks/useMaintenance';

export const RewardClaimForm: React.FC<IRewardClaimFormProps> = ({
  className,
  amountToClaim,
  hasLockedSov,
  hasLMRewards,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const claimRewardSovLocked = checkMaintenance(States.CLAIM_REWARD_SOV);
  const { send, ...tx } = useClaimRewardSov(hasLockedSov, hasLMRewards);
  return (
    <BaseClaimForm
      className={className}
      amountToClaim={amountToClaim}
      tx={tx}
      footer={<Footer />}
      onSubmit={send}
      claimLocked={claimRewardSovLocked}
    />
  );
};

const Footer: React.FC = () => (
  <>
    <Trans i18nKey={translations.rewardPage.claimForm.note} />{' '}
    <a
      href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
      target="_blank"
      rel="noreferrer noopener"
      className="tw-text-secondary tw-underline"
    >
      <Trans i18nKey={translations.rewardPage.claimForm.learn} />
    </a>
  </>
);
