import React, { useCallback, useMemo, useState } from 'react';
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
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';

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
    vesting.type,
  );
  const [address, setAddress] = useState(account);

  const { send, ...tx } = useSendToContractAddressTx(
    vesting.vestingContract,
    VestingAbi as AbiItem[],
    'withdrawTokens',
  );
  const vestingTxType = useMemo(
    () =>
      vesting.type === 'team'
        ? TxType.SOV_WITHDRAW_VESTING_TEAM
        : TxType.SOV_WITHDRAW_VESTING,
    [vesting],
  );

  const txConfig = useMemo(
    () => ({
      from: account,
      gas: gasLimit[vestingTxType],
    }),
    [account, vestingTxType],
  );

  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send([address.toLowerCase()], txConfig, { type: vestingTxType });
    }
  }, [address, send, tx, vestingTxType, txConfig]);

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
                data-action-id="portfolio-vesting-unlockSchedule"
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

          <TxFeeCalculator
            args={[address.toLowerCase()]}
            txConfig={txConfig}
            methodName="withdrawTokens"
            contractName="vesting"
            className="tw-my-5"
          />
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
            dataActionId={`portfolio-vesting-withdraw-confirm-${vesting.type}`}
          />
          <Button
            text={t(translations.common.cancel)}
            style={ButtonStyle.inverted}
            onClick={onClose}
            className="tw-ml-4 tw-w-full"
            dataActionId={`portfolio-vesting-withdraw-cancel-${vesting.type}`}
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
