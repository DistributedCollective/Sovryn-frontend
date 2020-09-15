/**
 *
 * LendingContractTest
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { fromWei } from 'web3-utils';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

interface Props {}

export function LendingContractTest(props: Props) {
  // const { useCacheCall } = drizzleReactHooks.useDrizzle();
  const { value: owner } = useCacheCallWithValue('LoadContractRBTC', 'owner');

  const { value: interestRate } = useCacheCallWithValue(
    'LoadContractRBTC',
    'profitOf',
    '0',
    '0x1BB2B1bEeDA1FB25Ee5da9CAE6c0F12CeD831128',
  );

  console.log('owner: ', owner);
  console.log('interest: ', interestRate);

  return <Div>{interestRate && fromWei(interestRate)}</Div>;
}

const Div = styled.div``;
