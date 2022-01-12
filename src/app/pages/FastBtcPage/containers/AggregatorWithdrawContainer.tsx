import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { WalletContext } from '@sovryn/react-wallet';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
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
import { getBridgeChainId } from 'app/pages/BridgeDepositPage/utils/helpers';
import { NetworkStep } from '../components/AggregatorWithdraw/NetworkStep';

export const AggregatorWithdrawContainer: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const dispatch = useDispatch();
  const { wallet } = useContext(WalletContext);

  const [state, setState] = useState<WithdrawContextStateType>(defaultValue);
  const { step } = state;

  const chainRequired = useMemo(() => getBridgeChainId(network), [network]);

  const value = useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state, setState],
  );

  useEffect(() => {
    dispatch(walletProviderActions.setBridgeChainId(chainRequired));
    return () => {
      // Unset bridge settings
      // dispatch(walletProviderActions.setBridgeChainId(null));
    };
  }, [chainRequired, dispatch]);

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
            {chainRequired !== wallet?.chainId ? (
              <NetworkStep network={network} />
            ) : (
              <>
                {step === WithdrawStep.MAIN && <MainScreen network={network} />}
                {step === WithdrawStep.AMOUNT && (
                  <AmountForm network={network} />
                )}
                {step === WithdrawStep.ADDRESS && <AddressForm />}
                {[
                  WithdrawStep.REVIEW,
                  WithdrawStep.CONFIRM,
                  WithdrawStep.PROCESSING,
                  WithdrawStep.COMPLETED,
                ].includes(step) && <ConfirmationScreens network={network} />}
              </>
            )}
          </div>
        </div>
      </div>
    </WithdrawContext.Provider>
  );
};
