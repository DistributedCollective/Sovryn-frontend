import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Text } from '@blueprintjs/core';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  currentChainId,
  graphWrapperUrl,
} from '../../../../../utils/classifiers';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useFetch } from '../../../../hooks/useFetch';
import { Asset } from 'types';
import {
  DenominationAsset,
  useGetTokenPrice,
} from 'app/hooks/useGetTokenPrice';

export function InfoBar() {
  const { t } = useTranslation();
  const [btcToUsd, setBtcToUsd] = useState({ value: '0', loading: true });

  const price = useGetTokenPrice(Asset.SOV, DenominationAsset.BTC);

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
    graphWrapperUrl[currentChainId] +
      `/sov/circulating-supply?stmp=${Date.now()}`,
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
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 22px;
  margin-bottom: 50px;

  div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    vertical-align: baseline;
    padding: 0 7px;
    margin-bottom: 10px;

    p {
      font-size: 0.75rem;
      font-weight: 400;
      margin-bottom: 0;

      &:first-child {
        line-height: 18px;
        margin-top: 1px;
        margin-right: 0.5em;
      }

      &:last-child {
        font-size: 16px;
        line-height: 19px;
        margin-bottom: 0;
        font-weight: 400;
      }
    }

    &.last {
      color: #fec004;
      & .title {
        font-weight: 400;
        letter-spacing: 0.6px;
      }
      & .value {
        font-weight: 600;
      }
    }
  }

  @media (max-width: 1280px) {
    div {
      flex-basis: 33%;
      flex-direction: column;
      align-items: flex-start;

      p:last-child {
        margin-top: 2px;
      }
    }
  }
`;
