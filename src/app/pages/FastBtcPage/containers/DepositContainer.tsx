import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { AmountForm } from '../components/Withdraw/AmountForm';
import {
  defaultValue,
  DepositContext,
  DepositContextStateType,
  DepositStep,
} from '../contexts/deposit-context';
import { MainScreen } from '../components/Deposit/MainScreen';
import { AddressForm } from '../components/Withdraw/AddressForm';
import { ConfirmationScreens } from '../components/Withdraw/ConfirmationScreens';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { Chain } from '../../../../types';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';

import styles from '../fast-btc-page.module.css';
import { SidebarStepsDeposit } from '../components/Deposit/SidebarStepsDeposit';
import { useDepositSocket } from '../hooks/useDepositSocket';

export const DepositContainer: React.FC = () => {
  const [state, setState] = useState<DepositContextStateType>(defaultValue);
  const { step } = state;

  const {
    ready,
    getDepositAddress,
    getDepositHistory,
    getTxAmount,
  } = useDepositSocket();

  const value = useMemo(
    () => ({
      ...state,
      ready,
      set: setState,
      requestDepositAddress: getDepositAddress,
    }),
    [state, ready, setState, getDepositAddress],
  );

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      limits: { ...prevState.limits, loading: true },
    }));

    if (ready) {
      getTxAmount()
        .then(result => {
          setState(prevState => ({
            ...prevState,
            limits: { ...result, loading: false },
          }));
        })
        .catch(() => {
          setState(prevState => ({
            ...prevState,
            limits: { ...prevState.limits, loading: false },
          }));
        });
    }
  }, [ready, getTxAmount]);

  useEffect(() => {
    console.log(ready);
    if (ready) {
      getTxAmount().then(console.log).catch(console.error);
    }
  }, [ready, getTxAmount]);

  return (
    <DepositContext.Provider value={value}>
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full">
        <div
          className={cn(
            'tw-relative tw-z-50 tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-pl-8',
            { invisible: false },
          )}
          style={{ minHeight: 'calc(100vh - 2.5rem)' }}
        >
          <SidebarStepsDeposit />
        </div>
        <div
          style={{
            minHeight: 'calc(100% - 2.5rem)',
          }}
          className="tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center"
        >
          <div className={styles.container}>
            {/*<SwitchTransition>*/}
            {/*  <CSSTransition*/}
            {/*    key={step}*/}
            {/*    addEndListener={(node, done) =>*/}
            {/*      node.addEventListener('transitionend', done, false)*/}
            {/*    }*/}
            {/*    classNames="fade"*/}
            {/*  >*/}
            {step === DepositStep.MAIN && <MainScreen />}
            {step === DepositStep.AMOUNT && <AmountForm />}
            {step === DepositStep.ADDRESS && <AddressForm />}
            {[
              DepositStep.REVIEW,
              DepositStep.CONFIRM,
              DepositStep.PROCESSING,
              DepositStep.COMPLETED,
            ].includes(step) && <ConfirmationScreens />}
            {/*</CSSTransition>*/}
            {/*</SwitchTransition>*/}
          </div>
        </div>
      </div>
    </DepositContext.Provider>
  );
};
