/**
 *
 * LendingContractTest
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useCacheCall } from '../../../hooks/useCacheCall';
import { fromWei } from 'web3-utils';

interface Props {}

export function LendingContractTest(props: Props) {
  // const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const owner = useCacheCall(
    'LoadContractRBTC',
    'owner',
  );

  const interestRate = useCacheCall(
    'LoadContractRBTC',
    'profitOf',
    '0x1BB2B1bEeDA1FB25Ee5da9CAE6c0F12CeD831128'
  );

  console.log('owner: ', owner);
  console.log('interest: ', interestRate);

  return <Div>{interestRate && fromWei(interestRate)}</Div>;
}

const Div = styled.div``;
