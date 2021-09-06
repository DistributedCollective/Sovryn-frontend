import React, { useCallback } from 'react';
import { Trans } from 'react-i18next';

import { translations } from 'locales/i18n';
import { TxType } from 'store/global/transactions-store/types';
import { gasLimit } from 'utils/classifiers';

import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';

export const RewardClaimForm: React.FC<IClaimFormProps> = ({
  className,
  address,
  amountToClaim,
}) => {
  const { send, ...tx } = useSendContractTx(
    'lockedSov',
    'createVestingAndStake',
  );

  const onSubmit = useCallback(() => {
    send(
      [],
      {
        from: address,
        gas: gasLimit[TxType.LOCKED_SOV_CLAIM],
      },
      {
        type: TxType.LOCKED_SOV_CLAIM,
      },
    );
  }, [address, send]);

  return (
    <BaseClaimForm
      className={className}
      amountToClaim={amountToClaim}
      tx={tx}
      footer={<Footer />}
      onSubmit={onSubmit}
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
