import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../selectors';
import { BuySell } from '../BuySell';
import { pairs, TradingTypes } from '../../types';
import { Asset } from 'types/asset';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from 'app/components/Promotions/components/PromotionCard/types';
import { MarketForm } from './MarketForm';

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT', // Deprecated in https://sovryn.atlassian.net/browse/SOV-4995
}

// Hardcoded because of https://sovryn.atlassian.net/browse/SOV-4995
const ORDER_TYPE = OrderType.MARKET;

export function TradeForm() {
  const [tradeType, setTradeType] = useState(TradingTypes.BUY);

  const [sourceToken, setSourceToken] = useState<Asset | undefined>();
  const [targetToken, setTargetToken] = useState<Asset | undefined>();

  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();

  const [linkPairType] = useState(location.state?.spotTradingPair);

  const { pairType } = useSelector(selectSpotTradingPage);

  useEffect(() => {
    setSourceToken(
      pairs[linkPairType || pairType][tradeType === TradingTypes.BUY ? 1 : 0],
    );
    setTargetToken(
      pairs[linkPairType || pairType][tradeType === TradingTypes.BUY ? 0 : 1],
    );
  }, [linkPairType, pairType, tradeType]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => linkPairType && history.replace(location.pathname), []);

  return (
    <>
      <div className="tw-trading-form-card tw-bg-black tw-rounded-3xl tw-p-4 tw-mx-auto xl:tw-mx-0 tw-relative">
        <div className="tw-mx-auto">
          <BuySell value={tradeType} onChange={setTradeType} />
          {sourceToken && targetToken && (
            <MarketForm
              sourceToken={sourceToken}
              targetToken={targetToken}
              tradeType={tradeType}
              hidden={ORDER_TYPE !== OrderType.MARKET}
              pair={pairs[linkPairType || pairType]}
            />
          )}
        </div>
      </div>
    </>
  );
}
