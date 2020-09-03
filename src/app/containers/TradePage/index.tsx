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
          <div className="d-flex flex-row justify-content-between mb-3 align-items-center">
            <div>
              <h2 className="d-inline-block">{asset}</h2>
              {position === TradingPosition.LONG && (
                <FontAwesomeIcon
                  className="d-inline-block h-100 ml-2 pb-1 text-customTeal"
                  icon={faArrowCircleUp}
                />
              )}
              {position === TradingPosition.SHORT && (
                <FontAwesomeIcon
                  className="d-inline-block h-100 ml-2 pb-1 text-customOrange"
                  icon={faArrowCircleDown}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div
              className="col-md-12 col-lg-4 mb-2 mr-0"
              style={{ minHeight: 400 }}
            >
              <TradingToken
                asset={asset}
                position={position}
                onPositionChange={setPosition}
              />
            </div>
            <div
              className="col-md-12 col-lg-8 order-first order-lg-last mb-2"
              style={{ minHeight: 400 }}
            >
              <TradingViewChart asset={asset} />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between mb-3 align-items-center">
            <h3 className="my-0">Your active loans</h3>
            <div className="text-right my-3">
              <Link className="btn btn-link text-white" to="/trading-history">
                <Icon icon={'history'} /> Trading history
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-12">{isConnected && <ActiveUserLoans />}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
