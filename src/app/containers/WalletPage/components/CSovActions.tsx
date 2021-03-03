import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { ClaimDialog } from './ClaimDialiog';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { useAccount } from '../../../hooks/useAccount';
// import { RedeemDialog } from './RedeemDialiog';

export enum DialogType {
  NONE,
  CLAIM,
  REDEEM,
}

interface Props {
  amount: string;
}

export function CSovActions(props: Props) {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(DialogType.NONE);

  const { value: processed, loading } = useCacheCallWithValue<boolean>(
    'vestingRegistry',
    'processedList',
    false,
    useAccount(),
  );

  return (
    <>
      {processed ? (
        <p className="text-gold tw-my-0" style={{ opacity: 0.3 }}>
          Already Claimed.
        </p>
      ) : (
        <>
          <Button
            minimal
            text={t(translations.userAssets.actions.claimSov)}
            className="text-gold button-round"
            onClick={() => setDialog(DialogType.CLAIM)}
            disabled={processed || parseInt(props.amount) === 0}
            loading={loading}
          />
          {/*<Button*/}
          {/*  minimal*/}
          {/*  text={t(translations.userAssets.actions.redeemRBTC)}*/}
          {/*  className="text-gold button-round"*/}
          {/*  onClick={() => setDialog(DialogType.REDEEM)}*/}
          {/*/>*/}
        </>
      )}
      <ClaimDialog
        isOpen={dialog === DialogType.CLAIM}
        onClose={() => setDialog(DialogType.NONE)}
        amount={props.amount}
      />
      {/*<RedeemDialog*/}
      {/*  isOpen={dialog === DialogType.REDEEM}*/}
      {/*  onClose={() => setDialog(DialogType.NONE)}*/}
      {/*  amount={props.amount}*/}
      {/*/>*/}
    </>
  );
}
