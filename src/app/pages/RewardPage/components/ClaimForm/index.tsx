/**
 *
 * ClaimForm
 *
 */

import React, { useEffect } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { gasLimit } from 'utils/classifiers';
import { TxType } from 'store/global/transactions-store/types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
interface Props {
  className?: object;
  address: string;
}
export function ClaimForm({ className, address }: Props) {
  const { t } = useTranslation();
  const { send } = useSendContractTx('lockedSov', 'createVestingAndStake');

  const { value: lockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getLockedBalance',
    '0',
    address,
  );

  const { value: unlockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getUnlockedBalance',
    '0',
    address,
  );

  useEffect(() => {
    console.log('unlockedBalance: ', unlockedBalance);
  }, [unlockedBalance]);

  const handleSubmit = () => {
    send(
      [],
      {
        from: address,
        gas: gasLimit[TxType.REMOVE_LIQUIDITY],
      },
      {
        type: TxType.REMOVE_LIQUIDITY,
      },
    );
  };
  return (
    <div
      className={cn(
        className,
        'tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-8 tw-mx-auto xl:tw-mx-0',
      )}
    >
      <div className="text-center tw-text-xl">
        {t(translations.rewardPage.claimForm.title)}
      </div>
      <div className="tw-mt-6">
        <div className="tw-text-sm tw-mb-1">
          {t(translations.rewardPage.claimForm.availble)}
        </div>
        <Input
          value={lockedBalance}
          readOnly={true}
          appendElem={<AssetRenderer asset={Asset.SOV} />}
        />
        <Button
          disabled={parseFloat(lockedBalance) === 0 || !lockedBalance}
          onClick={handleSubmit}
          className="tw-w-full tw-mt-10"
          text={t(translations.rewardPage.claimForm.cta)}
        />

        <div className="tw-text-xs tw-mt-4">
          {t(translations.rewardPage.claimForm.note) + ' '}
          <a href="/">{t(translations.rewardPage.claimForm.learn)}</a>
        </div>
      </div>
    </div>
  );
}
