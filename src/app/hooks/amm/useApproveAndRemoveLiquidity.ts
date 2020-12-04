import { useEffect } from 'react';
import { Asset } from 'types/asset';
import { Sovryn } from 'utils/sovryn';
import TokenAbi from 'utils/blockchain/abi/abiTestToken.json';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useRemoveLiquidity } from './useRemoveLiquidity';

export function useApproveAndRemoveLiquidity(
  asset: Asset,
  poolAddress: string,
  amount: string,
  minReturn: string,
) {
  useEffect(() => {
    if (
      poolAddress &&
      poolAddress !== '0x0000000000000000000000000000000000000000' &&
      !Sovryn.writeContracts.hasOwnProperty(`liquidity_${asset}`) &&
      Sovryn.writeContracts[
        `liquidity_${asset}`
      ]?.options?.address.toLowerCase() !== poolAddress.toLowerCase()
    ) {
      Sovryn.addWriteContract(`liquidity_${asset}`, {
        address: poolAddress,
        abi: TokenAbi as any,
      });
    }
    if (
      poolAddress &&
      poolAddress !== '0x0000000000000000000000000000000000000000' &&
      !Sovryn.contracts.hasOwnProperty(`liquidity_${asset}`) &&
      Sovryn.contracts[`liquidity_${asset}`]?.options?.address.toLowerCase() !==
        poolAddress.toLowerCase()
    ) {
      Sovryn.addReadContract(`liquidity_${asset}`, {
        address: poolAddress,
        abi: TokenAbi as any,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress]);

  const { withdraw, ...txState } = useRemoveLiquidity(
    asset,
    poolAddress,
    amount,
    minReturn,
  );

  return {
    withdraw: async () => {
      let tx: CheckAndApproveResult = {};
      if (asset !== Asset.BTC) {
        tx = await contractWriter.checkAndApproveContract(
          `liquidity_${asset}` as any,
          getContract('liquidityBTCProtocol').address,
          amount,
          // toWei('1000000', 'ether'),
          asset,
        );
        if (tx.rejected) {
          return;
        }
      }
      await withdraw(tx?.nonce, tx?.approveTx);
    },
    ...txState,
  };
}
