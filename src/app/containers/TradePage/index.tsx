/**
 *
 * TradePage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingViewChart } from '../../components/TradingViewChart';
import { Asset } from '../../../types/asset';
import { TradingTokenContainer } from '../TradingTokenContainer';
import { ActiveUserLoans } from '../../components/ActiveUserLoans';
import { useIsConnected } from '../../../hooks/useAccount';

interface Props {
  location: any;
}

export function TradePage(props: Props) {
  const params = useParams<{ asset: string }>();
  const isConnected = useIsConnected();

  const handleAssetParam = useCallback(() => {
    if (!params.asset) {
      return Asset.BTC;
    }
    return params.asset.toUpperCase() as Asset;
  }, [params]);

  const [asset, setAsset] = useState<Asset>(handleAssetParam());

  useEffect(() => {
    setAsset(handleAssetParam());
  }, [params, handleAssetParam]);

  return (
    <>
      <Header location={props.location.pathname} />
      <main>
        <div className="container">
          <h2 className="d-inline-block">{asset}</h2>
          <FontAwesomeIcon
            className="d-inline-block h-100 ml-2 pb-1 text-customTeal"
            icon={faArrowCircleUp}
          />

          {/*<ButtonGroup className="mb-3">*/}
          {/*  <Link to="/trade/btc" className="bp3-button bp3-active">*/}
          {/*    BTC*/}
          {/*  </Link>*/}
          {/*</ButtonGroup>*/}
          <div className="row">
            <div
              className="col-md-12 col-lg-4 mb-2 mr-0"
              style={{ minHeight: 400 }}
            >
              <TradingTokenContainer asset={asset} />
            </div>
            <div
              className="col-md-12 col-lg-8 order-first order-md-last mb-2"
              style={{ minHeight: 400 }}
            >
              <TradingViewChart asset={asset} />
            </div>
          </div>
          {isConnected && (
            <div className="row mt-4">
              <div className="col-12">
                <ActiveUserLoans />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
