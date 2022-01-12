import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { AmountForm } from '../components/Withdraw/AmountForm';
import {
  defaultValue,
  WithdrawContext,
  WithdrawContextStateType,
  WithdrawStep,
} from '../contexts/withdraw-context';
import { MainScreen } from '../components/Withdraw/MainScreen';
import { AddressForm } from '../components/Withdraw/AddressForm';
import { ConfirmationScreens } from '../components/Withdraw/ConfirmationScreens';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { SidebarStepsWithdraw } from '../components/Withdraw/SidebarStepsWithdraw';

import styles from '../fast-btc-page.module.css';
import { NetworkAwareComponentProps } from '../types';
import { getFastBTCWithdrawalContract } from '../helpers';

export const WithdrawContainer: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const [state, setState] = useState<WithdrawContextStateType>(defaultValue);
  const { step } = state;

  const value = useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state, setState],
  );

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      limits: { ...prevState.limits, loading: true },
    }));

    const { address, abi } = getFastBTCWithdrawalContract(
      network,
      'fastBtcBridge',
    );

    bridgeNetwork
      .call(network, address, abi, 'currentFeeStructureIndex', [])
      .then(feeStructureIndex => {
        bridgeNetwork
          .multiCall<{
            minTransferSatoshi: number;
            maxTransferSatoshi: number;
            feeStructures: { baseFeeSatoshi: number; dynamicFee: number };
          }>(network, [
            {
              address,
              abi,
              fnName: 'minTransferSatoshi',
              key: 'minTransferSatoshi',
              args: [],
              parser: value => value[0],
            },
            {
              address,
              abi,
              fnName: 'maxTransferSatoshi',
              key: 'maxTransferSatoshi',
              args: [],
              parser: value => value[0],
            },
            {
              address,
              abi,
              fnName: 'feeStructures',
              key: 'feeStructures',
              args: [feeStructureIndex],
              parser: ({ baseFeeSatoshi, dynamicFee }) => ({
                baseFeeSatoshi,
                dynamicFee,
              }),
            },
          ])
          .then(({ returnData }) => {
            setState(prevState => ({
              ...prevState,
              limits: {
                min: returnData.minTransferSatoshi,
                max: returnData.maxTransferSatoshi,
                baseFee: returnData.feeStructures.baseFeeSatoshi,
                dynamicFee: returnData.feeStructures.dynamicFee,
                loading: false,
              },
            }));
          });
      })
      .catch(error => {
        console.error(error);
        setState(prevState => ({
          ...prevState,
          limits: { ...prevState.limits, loading: false },
        }));
      });
  }, [network]);

  return (
    <WithdrawContext.Provider value={value}>
      <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-w-full">
        <div
          className={classNames(
            'tw-hidden tw-relative tw-z-50 tw-h-full md:tw-flex tw-flex-col tw-items-start tw-justify-center tw-pl-8',
            styles.wrapper,
          )}
        >
          <SidebarStepsWithdraw />
        </div>
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
