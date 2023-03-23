import React, { useEffect, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { ProviderType } from '@sovryn/wallet';
import { actions as walletProviderActions } from 'app/containers/WalletProvider/slice';
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
import { FastBtcDirectionType, NetworkAwareComponentProps } from '../types';
import { Signature } from '../contexts/deposit-context';
import { SignatureValidation } from '../components/Deposit/SignatureValidation';
import { isMainnet } from 'utils/classifiers';
import { Chain, ChainId } from 'types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { debug } from 'utils/debug';
import { useGetFastBtcDepositRskTransactionLazyQuery } from 'utils/graphql/rsk/generated';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';

type DepositContainerProps = NetworkAwareComponentProps & {
  type: FastBtcDirectionType;
};

export const DepositContainer: React.FC<DepositContainerProps> = ({
  network,
  type,
}) => {
  const log = debug('FastBTCDeposit');
  const [state, setState] = useState<DepositContextStateType>(defaultValue);
  const { step, depositTx } = state;
  const account = useAccount();

  const dispatch = useDispatch();
  const walletContext = useWalletContext();
  const [requiredSigners, setRequiredSigners] = useState<number | undefined>();

  const block = useBlockSync();

  useEffect(() => {
    const getRequiredSigners = async () => {
      try {
        const required: number = await contractReader.call(
          'fastBtcMultisig',
          'required',
          [],
        );
        setRequiredSigners(required);
      } catch (e) {
        console.error(e);
      }
    };

    getRequiredSigners();
  }, []);

  useEffect(() => {
    if (network === Chain.BSC) {
      if (walletContext.provider !== ProviderType.WEB3) {
        walletContext.disconnect();
      }

      //set the bridge chain id to BSC
      dispatch(
        walletProviderActions.setBridgeChainId(
          isMainnet ? ChainId.BSC_MAINNET : ChainId.BSC_TESTNET,
        ),
      );

      return () => {
        // Unset bridge settings
        dispatch(walletProviderActions.setBridgeChainId(null));
      };
    }
    // only run once on mounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        }));
        break;
    }
  }, []);

  const { ready, getDepositAddress, getTxAmount } = useDepositSocket(
    handleEvents,
  );

  const handleAddressRequest = useCallback(
    (address: string) => {
      setState(prevState => ({
        ...prevState,
        addressLoading: true,
      }));
      getDepositAddress(address)
        .then(response => {
          log.log(`checking for ${requiredSigners}: ${response.signatures}`);
          if (
            requiredSigners !== undefined &&
            response.signatures.length >= requiredSigners
          ) {
            setState(prevState => ({
              ...prevState,
              addressLoading: false,
              address: response.btcadr,
              step: DepositStep.VALIDATION,
              signatures: response.signatures as Signature[],
            }));
          } else {
            handleAddressRequest(address);
          }
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
    [getDepositAddress, requiredSigners, log],
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

  const [
    getDepositRskTransaction,
  ] = useGetFastBtcDepositRskTransactionLazyQuery();

  const getDepositRskTransactionHash = useCallback(async () => {
    const { data } = await getDepositRskTransaction({
      variables: {
        bitcoinTxHash: depositTx?.txHash,
        user: account.toLowerCase(),
      },
    });

    return data?.bitcoinTransfers[0]?.updatedAtTx?.id;
  }, [account, depositTx?.txHash, getDepositRskTransaction]);

  useEffect(() => {
    if (step === DepositStep.PROCESSING && depositTx?.txHash) {
      getDepositRskTransactionHash()
        .then(result => {
          if (result) {
            setState(prevState => ({
              ...prevState,
              depositRskTransactionHash: result,
              step: DepositStep.COMPLETED,
            }));
          }
        })
        .catch(console.error);
    }
  }, [depositTx?.txHash, getDepositRskTransactionHash, step, block]);

  return (
    <DepositContext.Provider value={value}>
      <div
        style={{
          minHeight: step === DepositStep.MAIN ? 'auto' : 510,
        }}
        className="tw-flex tw-flex-col tw-items-center tw-w-full"
      >
        <SidebarStepsDeposit network={network} type={type} />
        <div
          className={classNames(
            'tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center',
            styles.wrapper,
          )}
        >
          <div className={styles.container}>
            {step === DepositStep.MAIN && (
              <MainScreen network={network} type={type} />
            )}
            {step === DepositStep.VALIDATION && (
              <SignatureValidation onClick={handleValidation} type={type} />
            )}
            {step === DepositStep.ADDRESS && <AddressForm type={type} />}
            {[DepositStep.PROCESSING, DepositStep.COMPLETED].includes(step) && (
              <StatusScreen network={network} />
            )}
          </div>
        </div>
      </div>
    </DepositContext.Provider>
  );
};
