import { getContract } from 'utils/blockchain/contract-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { contractReader } from 'utils/sovryn/contract-reader';
// import {
//   TxStatus,
//   TxType,
// } from '../../../store/global/transactions-store/types';

export function staking_stake(
  weiAmount: string,
  untilTs: number,
  account: string,
  nonce: number,
) {
  return contractWriter.send(
    'staking',
    'stake',
    [weiAmount, untilTs, ethGenesisAddress, ethGenesisAddress],
    { from: account, nonce: nonce, gas: 250000 },
    // { type: TxType.STAKE }
  );
}

export function staking_approve(
  weiAmount: string,
  account: string,
  nonce: number,
) {
  return contractWriter.send(
    'sovToken',
    'approve',
    [
      getContract('staking').address,
      weiAmount,
      {
        from: account,
        nonce,
      },
    ],
    // {},
    // { type: TxType.APPROVE }
  );
}

export function staking_withdraw(
  weiAmount: string,
  until: Number,
  account: string,
) {
  return contractWriter.send(
    'staking',
    'withdraw',
    [
      weiAmount,
      until,
      account,
      {
        from: account,
      },
    ],
    // {},
    // { type: TxType.WITHDRAW }
  );
}

export function staking_allowance(account: string) {
  return contractReader.call('sovToken', 'allowance', [
    account,
    getContract('staking').address,
  ]);
}

export function staking_increaseStake(
  weiAmount: string,
  account: string,
  nonce: number,
) {
  return contractWriter.send(
    'staking',
    'increaseStake',
    [
      weiAmount,
      ethGenesisAddress,
      {
        from: account,
        nonce,
        gasLimit: 250000,
      },
    ],
    // {},
    // { type: TxType.STAKE }
  );
}

export function staking_extendStakingDuration(
  prevUntil: number,
  until: number,
  account: string,
) {
  return contractWriter.send(
    'staking',
    'extendStakingDuration',
    [
      prevUntil,
      until + 86400, // adding 24 hours to date to make sure contract will not choose previous period.
      {
        from: account,
      },
    ],
    // {},
    // { type: TxType.EXTEND }
  );
}

export function staking_delegate(address: string, lockDate: number, account) {
  return contractWriter.send(
    'staking',
    'delegate',
    [address, lockDate, { from: account }],
    // {},
    // { type: TxType.DELEGATE }
  );
}

export function staking_getPriorUserStakeByDate(
  address: string,
  date: number,
  blockNumber: number,
) {
  return contractReader.call('staking', 'getPriorUserStakeByDate', [
    address,
    date,
    blockNumber,
  ]);
}
