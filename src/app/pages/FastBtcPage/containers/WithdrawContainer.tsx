import React, { useEffect, useMemo, useState } from 'react';
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
import { Chain } from '../../../../types';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';

export const WithdrawContainer: React.FC = () => {
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

    const { address, abi } = getContract('fastBtcBridge');

    contractReader
      .call('fastBtcBridge', 'currentFeeStructureIndex', [])
      .then(feeStructureIndex => {
        bridgeNetwork
          .multiCall<{
            minTransferSatoshi: number;
            maxTransferSatoshi: number;
            feeStructures: { baseFeeSatoshi: number; dynamicFee: number };
          }>(Chain.RSK, [
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
  }, []);

  return (
    <WithdrawContext.Provider value={value}>
      {/*<SwitchTransition>*/}
      {/*  <CSSTransition*/}
      {/*    key={step}*/}
      {/*    addEndListener={(node, done) =>*/}
      {/*      node.addEventListener('transitionend', done, false)*/}
      {/*    }*/}
      {/*    classNames="fade"*/}
      {/*  >*/}
      {step === WithdrawStep.MAIN && <MainScreen />}
      {step === WithdrawStep.AMOUNT && <AmountForm />}
      {step === WithdrawStep.ADDRESS && <AddressForm />}
      {[
        WithdrawStep.REVIEW,
        WithdrawStep.CONFIRM,
        WithdrawStep.PROCESSING,
        WithdrawStep.COMPLETED,
      ].includes(step) && <ConfirmationScreens />}
      {/*</CSSTransition>*/}
      {/*</SwitchTransition>*/}
    </WithdrawContext.Provider>
  );
};
