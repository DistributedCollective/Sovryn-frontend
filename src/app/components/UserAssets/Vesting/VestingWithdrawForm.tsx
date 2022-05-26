import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'app/hooks/useAccount';
import { useGetUnlockedVesting } from 'app/hooks/staking/useGetUnlockedVesting';
import { useSendToContractAddressTx } from 'app/hooks/useSendToContractAddressTx';
import VestingAbi from 'utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';
import { TxType } from 'store/global/transactions-store/types';
import { FullVesting } from './types';
import { translations } from 'locales/i18n';
import { FieldGroup } from '../../FieldGroup';
import { DummyField } from '../../DummyField';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import { InputField } from '../../InputField';
import { Button, ButtonStyle } from '../../Button';
import { AssetSymbolRenderer } from '../../AssetSymbolRenderer';
import { VestingUnlockScheduleDialog } from './VestingUnlockScheduleDialog';
import { gasLimit } from 'utils/classifiers';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { Icon } from 'app/components/Icon';

type VestingWithdrawFormProps = {
  vesting: FullVesting;
  onClose: () => void;
};

export const VestingWithdrawForm: React.FC<VestingWithdrawFormProps> = ({
  vesting,
  onClose,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { value, loading } = useGetUnlockedVesting(
    vesting.staking,
    vesting.vestingContract,
  );
  const [address, setAddress] = useState(account);

  const { send, ...tx } = useSendToContractAddressTx(
    vesting.vestingContract,
    VestingAbi as AbiItem[],
    'withdrawTokens',
  );
  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send(
        [address.toLowerCase()],
        { from: account, gas: gasLimit[TxType.SOV_WITHDRAW_VESTING] },
        { type: TxType.SOV_WITHDRAW_VESTING },
      );
    }
  }, [account, address, send, tx]);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const openSchedule = useCallback(event => {
    event.preventDefault();
    setScheduleOpen(true);
  }, []);
  const closeSchedule = useCallback(() => setScheduleOpen(false), []);

  return (
    <>
      <div className="tw-relative tw-w-full tw-text-sov-white tw-tracking-normal tw-bg-black tw-rounded-2xl tw-p-7 tw-max-w-md tw-mx-auto">
        <div className="tw-px-9">
          <h2 className="tw-mb-11 tw-mt-4 tw-text-3xl tw-font-medium tw-text-center tw-transform-none tw-leading-6">
            {t(translations.vestingDialog.title)}
          </h2>
          <p>{t(translations.vestingDialog.subtitle)}</p>
          <FieldGroup label={t(translations.vestingDialog.amount)}>
            <DummyField>
              <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                <div className="tw-w-full tw-flex-grow tw-text-center">
                  {loading
                    ? t(translations.vestingDialog.calculating)
                    : weiTo4(value)}
                </div>
                <div className="tw-flex-shrink tw-flex-grow-0 tw-absolute tw-right-0">
                  <AssetSymbolRenderer asset={vesting.asset} />
                </div>
              </div>
            </DummyField>
            <div className="tw-text-right tw-mt-2">
              <span
                className="tw-link tw-cursor-pointer tw-text-xs"
                onClick={openSchedule}
              >
                {t(translations.vestingDialog.schedule)}
              </span>
            </div>
          </FieldGroup>
          <div className="tw-text-center tw-mx-auto">
            <Icon
              icon="arrow-down-wide"
              className="tw-mx-auto tw-m-5"
              size={50}
            />
          </div>
          <FieldGroup
            label={t(translations.vestingDialog.receiver, {
              asset: vesting.asset,
            })}
          >
            <InputField
              onChange={event => setAddress(event.target.value)}
              value={address}
            />
          </FieldGroup>

          <div className="tw-text-white tw-text-sm tw-font-normal tw-mx-9 tw-my-5">
            {t(translations.common.fee, { amount: '0.000019' })}
          </div>
        </div>

        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
          <Button
            text={t(translations.common.confirm)}
            onClick={() => handleSubmit()}
            className={`tw-mr-4 tw-w-full ${
              value === '0' ||
              (tx.loading && `tw-opacity-25 tw-cursor-not-allowed`)
            }`}
            loading={tx.loading}
            disabled={value === '0' || tx.loading}
          />
          <Button
            text={t(translations.common.cancel)}
            style={ButtonStyle.inverted}
            onClick={onClose}
            className="tw-ml-4 tw-w-full"
          />
        </div>
      </div>
      <VestingUnlockScheduleDialog
        vesting={vesting}
        isOpen={scheduleOpen}
        onClose={closeSchedule}
      />
      <TransactionDialog tx={tx} />
    </>
  );
};
