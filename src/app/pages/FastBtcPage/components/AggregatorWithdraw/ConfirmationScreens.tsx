import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import {
  toWei,
  weiToFixed,
} from '../../../../../utils/blockchain/math-helpers';
import { gasLimit } from '../../../../../utils/classifiers';
import {
  TxStatus,
  TxType,
} from '../../../../../store/global/transactions-store/types';
import { NetworkAwareComponentProps } from '../../types';
import { ReviewScreen } from '../Withdraw/ReviewScreen';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { getFastBTCWithdrawalContract } from '../../helpers';
import { getContract } from 'utils/blockchain/contract-helpers';
import { useAccount } from 'app/hooks/useAccount';
import { bignumber } from 'mathjs';
import { useChainToSendContractTx } from 'app/hooks/useChainToSendContractTx';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { Chain } from 'types';
import { StatusScreen } from '../Withdraw/StatusScreen';

const { abi: erc20Abi } = getContract('SOV_token');

export const ConfirmationScreens: React.FC<NetworkAwareComponentProps> = ({
  network,
}) => {
  const owner = useAccount();
  const { step, address, amount, set } = useContext(WithdrawContext);

  const [loading, setLoading] = useState(false);

  const basset = getFastBTCWithdrawalContract(Chain.RSK, 'aggregatorBasset');
  const token = getFastBTCWithdrawalContract(network, 'btcToken');
  const aggregator = getFastBTCWithdrawalContract(network, 'aggregator');

  const { send: transfer, ...tx } = useChainToSendContractTx(
    network,
    aggregator.address,
    aggregator.abi,
    'redeemToBridge',
  );

  const { send: approve, ...approveTx } = useChainToSendContractTx(
    network,
    token.address,
    token.abi,
    'approve',
  );

  const statusRef = useRef(TxStatus.NONE);

  const handleTransfer = useCallback(
    async (nonce?: number) => {
      set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));
      const userData = defaultAbiCoder.encode(
        ['address', 'string'],
        [owner, address],
      );

      transfer(
        [
          basset.address,
          toWei(weiToFixed(toWei(amount), 9)), // make sure we are sending on 9 decimals places and rounding down.
          getContract('fastBtcBridge').address,
          userData,
        ],
        {
          gas: gasLimit[TxType.FAST_BTC_WITHDRAW],
          nonce,
        },
      );
    },
    [set, transfer, address, amount, owner, basset.address],
  );

  const handleApprove = useCallback(async () => {
    set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));
    const nonce = await bridgeNetwork.nonce(network);
    // todo: change amount to MILLION
    const result = await approve([aggregator.address, toWei(amount)], {
      gas: gasLimit[TxType.APPROVE],
      nonce,
    });

    if (result) {
      await handleTransfer(nonce + 1);
    }
  }, [network, aggregator.address, amount, approve, handleTransfer, set]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);

    const allowance = await bridgeNetwork
      .call(network, token.address, erc20Abi, 'allowance', [
        owner,
        aggregator.address,
      ])
      .then(response => response.toString());

    if (bignumber(allowance).lt(toWei(amount))) {
      handleApprove().finally(() => setLoading(false));
    } else {
      handleTransfer().finally(() => setLoading(false));
    }
  }, [
    network,
    token.address,
    aggregator.address,
    amount,
    owner,
    handleApprove,
    handleTransfer,
  ]);

  useEffect(() => {
    if (tx.status !== statusRef.current) {
      statusRef.current = tx.status;

      let newStep: WithdrawStep | undefined;

      switch (tx.status) {
        case TxStatus.PENDING:
        case TxStatus.FAILED:
          newStep = WithdrawStep.PROCESSING;
          break;
        case TxStatus.CONFIRMED:
          newStep = WithdrawStep.COMPLETED;
          break;
      }

      if (newStep) {
        set(prevState => ({ ...prevState, step: newStep as WithdrawStep }));
      }
    }
  }, [tx.status, set]);

  const currentTx = useMemo(() => {
    return tx || approveTx;
  }, [tx, approveTx]);

  if (step === WithdrawStep.REVIEW) {
    return (
      <ReviewScreen
        onConfirm={handleConfirm}
        network={network}
        loading={loading}
      />
    );
  }

  return <StatusScreen tx={currentTx} network={network} />;
};
