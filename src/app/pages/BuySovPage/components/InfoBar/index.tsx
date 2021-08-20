import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import { backendUrl, currentChainId } from '../../../../../utils/classifiers';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useFetch } from '../../../../hooks/useFetch';

export function InfoBar() {
  const { t } = useTranslation();
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
    value: { circulating_supply: totalSupply },
    loading: totalSupplyLoading,
  } = useFetch<{ circulating_supply: number; insertion_time: Date }>(
    backendUrl[currentChainId] + '/sov/circulating-supply',
    { circulating_supply: 0 },
  );

  const marketCap = useMemo(() => {
    return (
      Number(btcToUsd.value) * (Number(price.value) / 1e8) * Number(totalSupply)
    );
  }, [btcToUsd.value, price.value, totalSupply]);

  return (
    <>
      <StyledInfoBar>
        <div className="">
          <Text ellipsize tagName="p">
            {t(translations.buySovPage.stats.circulatingSupply)}
          </Text>
          <Text ellipsize tagName="p">
            <LoadableValue
              loading={totalSupplyLoading}
              value={toNumberFormat(totalSupply, 2)}
              tooltip={totalSupply}
            />{' '}
            SOV
          </Text>
        </div>
        <div className="">
          <Text ellipsize tagName="p">
            {t(translations.buySovPage.stats.marketCap)}
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
        <div className="last">
          <Text ellipsize tagName="p" className="title">
            {t(translations.buySovPage.stats.lastPrice)}
          </Text>
          <Text ellipsize tagName="p" className="value">
            <LoadableValue
              loading={price.loading}
              value={Number(price.value).toFixed(0)}
              tooltip={Number(price.value).toFixed(0)}
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
  justify-content: space-around;
  border-top: 1px solid #d9d9d9;
  padding-top: 10px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 6px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 38px;
  p {
    font-size: 0.75rem;
    font-weight: 300;
    margin-bottom: 0;
    &:last-child {
      font-size: 1.125rem;
      margin-bottom: 0;
      font-weight: 400;
      margin-top: 2px;
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
    color: var(--primary);
    & .title {
      font-weight: 300;
      letter-spacing: 0.6px;
    }
    & .value {
      font-weight: 600;
    }
  }
`;
