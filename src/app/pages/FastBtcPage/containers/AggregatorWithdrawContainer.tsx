import React, { useContext, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { WalletContext } from '@sovryn/react-wallet';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
import { AmountForm } from '../components/AggregatorWithdraw/AmountForm';
import { WithdrawContext, WithdrawStep } from '../contexts/withdraw-context';
import { MainScreen } from '../components/Withdraw/MainScreen';
import { AddressForm } from '../components/Withdraw/AddressForm';
import { ConfirmationScreens } from '../components/AggregatorWithdraw/ConfirmationScreens';
import { SidebarStepsWithdraw } from '../components/Withdraw/SidebarStepsWithdraw';

import styles from '../fast-btc-page.module.css';
import { NetworkAwareComponentProps } from '../types';
import { getBridgeChainId } from 'app/pages/BridgeDepositPage/utils/helpers';
import { NetworkStep } from '../components/AggregatorWithdraw/NetworkStep';
import { useWithdrawBridgeConfig } from '../hooks/useWithdrawBridgeConfig';

export const AggregatorWithdrawContainer: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const dispatch = useDispatch();
  const { wallet } = useContext(WalletContext);

  const withdrawContext = useWithdrawBridgeConfig(network);
  const { step } = withdrawContext;

  const chainRequired = useMemo(() => getBridgeChainId(network), [network]);

  useEffect(() => {
    dispatch(walletProviderActions.setBridgeChainId(chainRequired));
    return () => {
      // Unset bridge settings
      // dispatch(walletProviderActions.setBridgeChainId(null));
    };
  }, [chainRequired, dispatch]);

  return (
    <WithdrawContext.Provider value={withdrawContext}>
      <div className="tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-full">
        <SidebarStepsWithdraw network={network} />
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
