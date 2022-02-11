import { useGsnSendTx } from './useGsnSendTx';
import { ContractName } from '../../utils/types/contracts';
import { Chain, Asset } from '../../types';
import { bridgeNetwork } from '../pages/BridgeDepositPage/utils/bridge-network';
import { useCallback, useState } from 'react';
import { TxStatus, TxType } from '../../store/global/transactions-store/types';
import { getContract } from '../../utils/blockchain/contract-helpers';
import { useAccount } from './useAccount';
import { BigNumber } from 'ethers';
import { gasLimit } from '../../utils/classifiers';

type CheckAndApproveResult = {
  nonce?: number;
  approveTxHash?: string;
  error?: Error;
  rejected?: boolean;
  status: TxStatus;
  loading: boolean;
};

export const useGsnCheckAndApprove = (
  chain: Chain,
  contractName: ContractName,
  paymaster: string,
  useGSN: boolean = true,
  asset?: Asset,
) => {
  const address = useAccount();
  const { send, txHash, status, loading } = useGsnSendTx(
    chain,
    contractName,
    'approve',
    paymaster,
    useGSN,
  );

  const [result, setResult] = useState<CheckAndApproveResult>({
    status: TxStatus.NONE,
    loading: false,
  });

  const checkAndApprove = useCallback(
    async (
      spenderAddress: string,
      amountWei: string,
      customData?: any,
    ): Promise<CheckAndApproveResult> => {
      const checkAndApprove = async (
        spenderAddress: string,
        amountWei: string,
        customData?: any,
      ): Promise<CheckAndApproveResult> => {
        let nonce = await bridgeNetwork.nonce(chain);
        const approveGasPrice = await bridgeNetwork
          .getNode(chain)
          .getGasPrice();
        const contract = getContract(contractName);

        let allowance = '';
        try {
          allowance = await bridgeNetwork.call(
            chain,
            contract.address,
            contract.abi,
            'allowance',
            [address.toLowerCase(), getContract('perpetualManager').address],
          );
        } catch (error) {
          return {
            loading: false,
            rejected: true,
            status: TxStatus.NONE,
            error,
            nonce,
          };
        }

        if (allowance && BigNumber.from(allowance).lt(amountWei)) {
          try {
            let approveTxHash = await send(
              [spenderAddress, amountWei],
              {
                nonce,
                from: address,
                gas: gasLimit[TxType.APPROVE],
                gasPrice: approveGasPrice,
              },
              {
                asset,
                assetAmount: '0',
                customData,
                type: TxType.APPROVE,
              },
            );
            nonce += 1;
            return {
              loading: true,
              rejected: false,
              status: TxStatus.PENDING,
              approveTxHash: approveTxHash || undefined,
              nonce,
            };
          } catch (error) {
            return {
              loading: false,
              rejected: true,
              status: TxStatus.FAILED,
              error,
              nonce,
            };
          }
        }
        return {
          loading: false,
          rejected: false,
          status: TxStatus.NONE,
        };
      };

      const promise = checkAndApprove(spenderAddress, amountWei, customData);
      promise.then(setResult);
      return promise;
    },
    [address, asset, chain, contractName, send],
  );

  return {
    nonce: result.nonce,
    approveTxHash: txHash,
    error: result.error,
    rejected: result.rejected,
    status: status,
    loading: loading,
    checkAndApprove,
  };
};
