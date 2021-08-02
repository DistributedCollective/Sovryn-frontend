/**
 *
 * RewardForm
 *
 */

import React from 'react';
import styled from 'styled-components/macro';

import { useAccount } from 'app/hooks/useAccount';

import { ClaimForm } from '../ClaimForm';

export function RewardForm() {
  const userAddress = useAccount();
  return (
    <Box>
      <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center">
        <ClaimForm address={userAddress} />
      </div>
      <div className="tw-w-1/2 tw-flex tw-justify-center tw-align-center"></div>
    </Box>
  );
}

const Box = styled.div`
  background-color: #222222;
  width: 100%;
  display: flex;
  flex-direction: row;
`;
