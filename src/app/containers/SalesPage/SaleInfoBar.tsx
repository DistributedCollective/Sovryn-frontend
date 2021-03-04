import React from 'react';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { LoadableValue } from '../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { useSaleCalculator } from './hooks/useSaleCalculator';
import { useSaleEndTime } from './hooks/useSaleEndTime';

export function SaleInfoBar() {
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

  const { unitPriceBtc, rate, loading: btcRateLoading } = useSaleCalculator(
    '1',
  );

  const { dateString, loading: loadingEndTime } = useSaleEndTime();

  return (
    <>
      <InfoBar>
        <div className="col">
          <Text ellipsize tagName="p">
            Total Supply:
          </Text>
          <Text ellipsize tagName="p">
            {weiToNumberFormat(100000000e18)} SOV
          </Text>
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Sale Allocation:
          </Text>
          <LoadableValue
            loading={allocationLoading}
            value={
              <Text ellipsize tagName="p">
                {weiToNumberFormat(allocation)} SOV
              </Text>
            }
          />
        </div>
        <div className="col">
          <Text ellipsize tagName="p" className="text-gold">
            Allocation Remaining:
          </Text>
          <LoadableValue
            loading={availableTokensLoading}
            value={
              <Text ellipsize tagName="p" className="tw-font-bold text-gold">
                {remainingPercent}% ≈ {weiToNumberFormat(availableTokens)} SOV
              </Text>
            }
          />
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Price:
          </Text>
          <LoadableValue
            loading={btcRateLoading}
            value={
              <Text ellipsize tagName="p">
                {toNumberFormat(unitPriceBtc * 1e8)} SATS / SOV
              </Text>
            }
            tooltip={<>{rate} SOV for 1 BTC</>}
          />
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Vesting:
          </Text>
          <Text ellipsize tagName="p">
            10 Months
          </Text>
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Accepted currencies:
          </Text>
          <Text ellipsize tagName="p">
            BTC, RBTC
          </Text>
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Token Sale End Time :
          </Text>
          <LoadableValue
            loading={loadingEndTime}
            value={
              <Text ellipsize tagName="p">
                {dateString}
              </Text>
            }
          />
        </div>
      </InfoBar>
      <InfoBarTip>
        <div className="col-12">
          <p className="tw-text-right">
            *(contributor) SOV can be exchanged 1:1 for staked SOV after
            bitocracy launch
          </p>
        </div>
      </InfoBarTip>
    </>
  );
}

const InfoBarTip = styled.div.attrs(() => ({
  className: 'row',
}))`
  padding-top: 10px;
  padding-bottom: 10px;
  max-width: 1520px;
  margin-left: auto;
  margin-right: auto;
  p {
    font-size: 14px;
    line-height: 22px;
    font-weight: 100;
    margin-bottom: 0;
  }
`;

const InfoBar = styled.div.attrs(() => ({
  className: 'row',
}))`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 17px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 10px;
  max-width: 1520px;
  margin-left: auto;
  margin-right: auto;
  p {
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 5px;
    @media (min-width: 1500px) {
      font-size: 16px;
    }
    &:last-child {
      font-size: 16px;
      margin-bottom: 0;
      font-weight: 400;
      @media (min-width: 1500px) {
        font-size: 20px;
      }
    }
  }
  .col {
    padding: 0 7px;
    @media (max-width: 1280px) {
      flex-basis: 33%;
    }
  }
  @media only screen and (max-width: 640px) {
    & .col {
      flex-basis: 50%;
      & p:first-child {
        margin-bottom: 5px;
      }
      margin-bottom: 25px;
    }
  }
`;
