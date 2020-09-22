/**
 *
 * TradePage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleDown,
  faArrowCircleUp,
} from '@fortawesome/free-solid-svg-icons';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingViewChart } from '../../components/TradingViewChart';
import { Asset } from '../../../types/asset';
import { ActiveUserLoans } from '../ActiveUserLoans';
import { useIsConnected } from '../../hooks/useAccount';
import { TradingToken } from '../TradingToken';
import { TradingActivity } from '../TradingActivity';
import { TradingPosition } from '../../../types/trading-position';
import { Icon } from '@blueprintjs/core';

export function TradePage() {
  const params = useParams<{ asset: string }>();
  const isConnected = useIsConnected();

  const handleAssetParam = useCallback(() => {
    if (!params.asset) {
      return Asset.BTC;
    }
    return params.asset.toUpperCase() as Asset;
  }, [params]);

  const [asset, setAsset] = useState<Asset>(handleAssetParam());
  const [position, setPosition] = useState<TradingPosition>(
    TradingPosition.LONG,
  );

  useEffect(() => {
    setAsset(handleAssetParam());
  }, [params, handleAssetParam]);

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="row">
            <div
              className="col-md-12 col-lg-5 mb-2 mr-0"
              style={{ minHeight: 400 }}
            >
              <TradingToken
                asset={asset}
                position={position}
                onPositionChange={setPosition}
              />
            </div>
            <div
              className="col-md-12 col-lg-7 order-first order-lg-last mb-2"
              style={{ minHeight: 400 }}
            >
              <TradingViewChart asset={asset} />
            </div>
          </div>
          <TradingActivity />
        </div>
      </main>
      <Footer />
    </>
  );
}
