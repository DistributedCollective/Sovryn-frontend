import React from 'react';
import styled from 'styled-components/macro';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { LoadableValue } from '../../components/LoadableValue';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { useSaleCalculator } from './hooks/useSaleCalculator';

export function SaleInfoBar() {
  const { value: supply, loading: supplyLoading } = useCacheCallWithValue(
    'CSOV_token',
    'totalSupply',
    '0',
  );
  const {
    value: allocation,
    loading: allocationLoading,
  } = useCacheCallWithValue('CrowdSale', 'crowdSaleSupply', '0');
  const {
    value: availableTokens,
    loading: availableTokensLoading,
  } = useCacheCallWithValue('CrowdSale', 'availableTokens', '0');

  let remainingPercent = '100';
  if (allocation !== '0' && availableTokens !== '0') {
    remainingPercent = bignumber(availableTokens)
      .div(allocation)
      .mul(100)
      .toFixed(2);
  }

  const { unitPrice, rate, loading: btcRateLoading } = useSaleCalculator('1');

  return (
    <InfoBar>
      <div>
        <p>Total Supply:</p>
        <LoadableValue
          loading={supplyLoading}
          value={<p>{weiToNumberFormat(supply)} SOV</p>}
        />
      </div>
      <div>
        <p>Sales Allocation:</p>
        <LoadableValue
          loading={allocationLoading}
          value={<p>{weiToNumberFormat(allocation)} SOV</p>}
        />
      </div>
      <div>
        <p>Allocation Remaining:</p>
        <LoadableValue
          loading={availableTokensLoading}
          value={
            <p>
              {remainingPercent}% ≈ {weiToNumberFormat(availableTokens)} SOV
            </p>
          }
        />
      </div>
      <div>
        <p>Price:</p>
        <LoadableValue
          loading={btcRateLoading}
          value={<p>{numberToUSD(unitPrice, 2)}/SOV</p>}
          tooltip={<>{rate} satoshi for 1 SOV</>}
        />
      </div>
      <div>
        <p>Vesting:</p>
        <p>10 Months</p>
      </div>
      <div>
        <p>Accepted currencies:</p>
        <p>BTC, RBTC</p>
      </div>
      <div>
        <p>Token Sale End Time :</p>
        <p>16.00 CET, 8th Jan</p>
      </div>
    </InfoBar>
  );
}

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 20px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 20px;
  max-width: 1520px;
  margin-left: auto;
  margin-right: auto;
  p:last-child {
    font-size: 20px;
    margin-bottom: 0;
  }
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;
