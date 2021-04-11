import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiTo18 } from '../../../../../utils/blockchain/math-helpers';
import { backendUrl, currentChainId } from '../../../../../utils/classifiers';

export function InfoBar() {
  const [price, setPrice] = useState({ value: '0', loading: true });
  const [btcToUsd, setBtcToUsd] = useState({ value: '0', loading: true });

  useEffect(() => {
    const run = async () => {
      const result = await fetch(
        backendUrl[currentChainId] + '/sov/current-price',
      ).then(e => e.json());
      return String((result?.price || '0') * 1e8);
    };
    run()
      .then(e => {
        setPrice({ value: e, loading: false });
      })
      .catch(() => {
        setPrice({ value: '0', loading: false });
      });
  }, []);

  useEffect(() => {
    const run = async () => {
      const result = await fetch('https://blockchain.info/ticker').then(e =>
        e.json(),
      );
      return result?.USD?.last || '0';
    };
    run()
      .then(e => {
        setBtcToUsd({ value: e, loading: false });
      })
      .catch(() => {
        setBtcToUsd({ value: '0', loading: false });
      });
  }, []);

  const {
    value: totalSupply,
    loading: totalSupplyLoading,
  } = useCacheCallWithValue('SOV_token', 'totalSupply', '0');

  const marketCap = useMemo(() => {
    return (
      (Number(btcToUsd.value) *
        (Number(price.value) / 1e8) *
        Number(totalSupply)) /
      1e18
    );
  }, [btcToUsd.value, price.value, totalSupply]);

  return (
    <>
      <StyledInfoBar>
        <div className="col">
          <Text ellipsize tagName="p">
            Total Supply:
          </Text>
          <Text ellipsize tagName="p">
            <LoadableValue
              loading={totalSupplyLoading}
              value={weiToNumberFormat(totalSupply, 2)}
              tooltip={weiTo18(totalSupply)}
            />{' '}
            SOV
          </Text>
        </div>
        <div className="col">
          <Text ellipsize tagName="p">
            Market Cap:
          </Text>
          <Text ellipsize tagName="p">
            <LoadableValue
              loading={totalSupplyLoading || price.loading || btcToUsd.loading}
              value={toNumberFormat(marketCap, 2)}
              tooltip={marketCap}
            />{' '}
            USD
          </Text>
        </div>
        <div className="col last">
          <Text ellipsize tagName="p" className="title">
            Last Traded Price:
          </Text>
          <Text ellipsize tagName="p" className="value">
            <LoadableValue
              loading={price.loading}
              value={price.value}
              tooltip={price.value}
            />{' '}
            sats
          </Text>
        </div>
      </StyledInfoBar>
    </>
  );
}

const StyledInfoBar = styled.div.attrs(() => ({
  className: 'row',
}))`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 17px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 10px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
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
  & .last {
    color: #fec004;
    & .title {
      font-weight: 500;
    }
    & .value {
      font-weight: 900;
    }
  }
`;
