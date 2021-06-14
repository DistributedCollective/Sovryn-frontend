/**
 *
 * ClaimForm
 *
 */

import React from 'react';
// import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { Button } from 'app/components/Button';
import { useSendContractTx } from '../../../../hooks/useSendContractTx';
import { TxType } from 'store/global/transactions-store/types';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { gasLimit } from 'utils/classifiers';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
interface Props {
  className?: object;
  address: string;
}
export function ClaimForm({ className, address }: Props) {
  const { t } = useTranslation();
  const { send, ...tx } = useSendContractTx(
    'lockedSov',
    'createVestingAndStake',
  );

  const { value: lockedBalance } = useCacheCallWithValue(
    'lockedSov',
    'getLockedBalance',
    '',
    address,
  );

  const handleSubmit = () => {
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
  };
  return (
    <div className="tw-bg-gray-800 tw-staking-box tw-rounded-3xl tw-px-16 tw-py-12">
      <div className="md:tw-w-2/3 sm:tw-w-full tw-mx-auto">
        <div>
          <div className="tw-text-sm tw-mb-1">
            {t(translations.rewardPage.claimForm.availble)}
          </div>
          <Input
            value={weiToNumberFormat(lockedBalance, 4)}
            readOnly={true}
            appendElem={<AssetRenderer asset={Asset.SOV} />}
          />
        </div>
        <div>
          <Button
            disabled={parseFloat(lockedBalance) === 0 || !lockedBalance}
            onClick={handleSubmit}
            className="tw-w-full tw-mt-12 tw-uppercase"
            text={t(translations.rewardPage.claimForm.cta)}
          />

          <div className="tw-text-tiny tw-mt-6 tw-font-thin">
            {t(translations.rewardPage.claimForm.note) + ' '}
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/sovryn-rewards-explained"
              target="_blank"
              rel="noreferrer noopener"
              className="tw-text-secondary tw-underline"
            >
              {t(translations.rewardPage.claimForm.learn)}
            </a>
          </div>
        </div>
      </div>
      <TxDialog tx={tx} />
    </div>
  );
}
