import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from '../../../hooks/useAccount';
import { useGetUnlockedVesting } from '../../../hooks/staking/useGetUnlockedVesting';
import { useSendToContractAddressTx } from '../../../hooks/useSendToContractAddressTx';
import VestingAbi from '../../../../utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';
import { TxType } from '../../../../store/global/transactions-store/types';
import { FullVesting } from './types';
import styles from '../../../containers/WalletPage/components/dialog.module.scss';
import { translations } from '../../../../locales/i18n';
import { FieldGroup } from '../../FieldGroup';
import { DummyField } from '../../DummyField';
import { weiTo4 } from '../../../../utils/blockchain/math-helpers';
import classNames from 'classnames';
import arrowDown from '../../../containers/WalletPage/components/arrow-down.svg';
import { InputField } from '../../InputField';
import { Button, ButtonStyle, ButtonSize } from '../../Button';
import { AssetSymbolRenderer } from '../../AssetSymbolRenderer';
import { VestingUnlockScheduleDialog } from './VestingUnlockScheduleDialog';
import { gasLimit } from 'utils/classifiers';
import { TransactionDialog } from 'app/components/TransactionDialog';

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
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>
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
                <div
                  className={classNames(
                    'tw-flex-shrink tw-flex-grow-0 tw-absolute',
                    styles.right,
                  )}
                >
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
          <div className="tw-mx-auto tw-text-center">
            <img
              src={arrowDown}
              alt="Arrow Down"
              className={styles.arrowDown}
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

          <div className={styles.txFee}>
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
            size={ButtonSize.lg}
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
