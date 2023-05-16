import React, { useCallback, useMemo } from 'react';
import { Trans } from 'react-i18next';

import { useSendContractTx } from '../../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { BaseClaimForm } from '../BaseClaimForm';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { gasLimit } from 'utils/classifiers';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { getContract } from 'utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';

export const LiquidClaimForm: React.FC<IClaimFormProps> = ({
  className,
  amountToClaim,
  lastWithdrawalInterval,
}) => {
  const address = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const claimLiquidSovLocked = checkMaintenance(States.CLAIM_LIQUID_SOV);
  const { send, ...tx } = useSendContractTx('stakingRewards', 'collectReward');

  const { address: stakingRewardAddress } = getContract('stakingRewards');
  const { value: tokenBalance } = useCacheCallWithValue(
    'SOV_token',
    'balanceOf',
    '0',
    stakingRewardAddress,
  );

  const hasTokenBalance = useMemo(() => {
    return bignumber(tokenBalance).greaterThanOrEqualTo(amountToClaim);
  }, [amountToClaim, tokenBalance]);

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
      hasTokenBalance={hasTokenBalance}
      tx={tx}
      onSubmit={onSubmit}
      footer={<Footer />}
      claimLocked={claimLiquidSovLocked}
      dataActionId="liquidButton"
    />
  );
};

const Footer: React.FC = () => (
  <>
    <p className="tw-mb-2">
      <Trans i18nKey={translations.rewardPage.liquidClaimForm.txNote} />
    </p>
    <Trans i18nKey={translations.rewardPage.liquidClaimForm.note} />{' '}
    <a
      href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
      target="_blank"
      rel="noreferrer noopener"
      className="tw-text-secondary tw-underline"
      data-action-id="rewards-liquid-learnmore"
    >
      <Trans i18nKey={translations.rewardPage.liquidClaimForm.learn} />
    </a>
  </>
);
