import React, { useEffect, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {
  defaultValue,
  DepositContext,
  DepositContextStateType,
  DepositStep,
} from '../contexts/deposit-context';
import { MainScreen } from '../components/Deposit/MainScreen';
import { AddressForm } from '../components/Deposit/AddressForm';

import styles from '../fast-btc-page.module.css';
import { SidebarStepsDeposit } from '../components/Deposit/SidebarStepsDeposit';
import { useDepositSocket } from '../hooks/useDepositSocket';
import { StatusScreen } from '../components/Deposit/StatusScreen';
import { NetworkAwareComponentProps } from '../types';
import { Signature } from '../contexts/deposit-context';
import { SignatureValidation } from '../components/Deposit/SignatureValidation';

export const DepositContainer: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const [state, setState] = useState<DepositContextStateType>(defaultValue);
  const { step } = state;

  const handleEvents = useCallback((type: string, value: any) => {
    switch (type) {
      case 'txAmount':
        setState(prevState => ({
          ...prevState,
          limits: { ...value, loading: false },
        }));
        break;
      case 'depositTx':
        setState(prevState => ({
          ...prevState,
          depositTx: value,
          step: DepositStep.PROCESSING,
        }));
        break;
      case 'transferTx':
        setState(prevState => ({
          ...prevState,
          transferTx: value,
          step: DepositStep.COMPLETED,
        }));
        break;
    }
  }, []);

  const { ready, getDepositAddress, getTxAmount } = useDepositSocket(
    handleEvents,
  );

  const handleAddressRequest = useCallback(
    (address: string) => {
      setState(prevState => ({ ...prevState, addressLoading: true }));
      getDepositAddress(address)
        .then(response => {
          setState(prevState => ({
            ...prevState,
            addressLoading: false,
            address: response.btcadr,
            step: DepositStep.VALIDATION,
            signatures: response.signatures as Signature[],
          }));
        })
        .catch(error => {
          console.error(error);
          setState(prevState => ({
            ...prevState,
            addressLoading: false,
            address: '',
            addressError: error.message,
          }));
        });
    },
    [getDepositAddress],
  );

  const handleValidation = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      step: DepositStep.ADDRESS,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      set: setState,
      requestDepositAddress: handleAddressRequest,
    }),
    [state, ready, setState, handleAddressRequest],
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

  return (
    <DepositContext.Provider value={value}>
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full">
        <div
          className={classNames(
            'tw-hidden tw-relative tw-z-50 tw-h-full md:tw-flex tw-flex-col tw-items-start tw-justify-center tw-pl-8',
            styles.wrapper,
          )}
        >
          <SidebarStepsDeposit />
        </div>
        <div
          className={classNames(
            'tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center',
            styles.wrapper,
          )}
        >
          <div className={styles.container}>
            {step === DepositStep.MAIN && <MainScreen network={network} />}
            {step === DepositStep.VALIDATION && (
              <SignatureValidation onClick={handleValidation} />
            )}
            {step === DepositStep.ADDRESS && <AddressForm />}
            {[DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step) && (
              <StatusScreen network={network} />
            )}
          </div>
        </div>
      </div>
    </DepositContext.Provider>
  );
};
