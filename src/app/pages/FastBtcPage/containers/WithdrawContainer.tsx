import React from 'react';
import classNames from 'classnames';
import { AmountForm } from '../components/Withdraw/AmountForm';
import { WithdrawContext, WithdrawStep } from '../contexts/withdraw-context';
import { MainScreen } from '../components/Withdraw/MainScreen';
import { AddressForm } from '../components/Withdraw/AddressForm';
import { ConfirmationScreens } from '../components/Withdraw/ConfirmationScreens';
import { SidebarStepsWithdraw } from '../components/Withdraw/SidebarStepsWithdraw';

import styles from '../fast-btc-page.module.css';
import { Chain } from 'types';
import { useWithdrawBridgeConfig } from '../hooks/useWithdrawBridgeConfig';

export const WithdrawContainer: React.FC = () => {
  const network = Chain.RSK;

  const value = useWithdrawBridgeConfig();
  const { step } = value;

  return (
    <WithdrawContext.Provider value={value}>
      <div className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-full">
        <SidebarStepsWithdraw network={network} />
        <div
          className={classNames(
            'tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center',
            styles.wrapper,
          )}
        >
          <div className={styles.container}>
            {step === WithdrawStep.MAIN && <MainScreen network={network} />}
            {step === WithdrawStep.AMOUNT && <AmountForm network={network} />}
            {step === WithdrawStep.ADDRESS && <AddressForm />}
            {[
              WithdrawStep.REVIEW,
              WithdrawStep.CONFIRM,
              WithdrawStep.PROCESSING,
              WithdrawStep.COMPLETED,
            ].includes(step) && <ConfirmationScreens network={network} />}
          </div>
        </div>
      </div>
    </WithdrawContext.Provider>
  );
};
