/**
 *
 * TradePage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TradingViewChart } from '../../components/TradingViewChart';
import { Asset } from '../../../types/asset';
import { useParams } from 'react-router-dom';
import { TradingTokenContainer } from '../TradingTokenContainer';

interface Props {}

export function TradePage(props: Props) {
  const params = useParams<{ asset: string }>();

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
      <Header />
      <main>
        <div className="container">
          <h1>{asset}</h1>
          {/*<ButtonGroup className="mb-3">*/}
          {/*  <Link to="/trade/btc" className="bp3-button bp3-active">*/}
          {/*    BTC*/}
          {/*  </Link>*/}
          {/*</ButtonGroup>*/}
          <div className="row">
            <div className="col-4" style={{ minHeight: 400 }}>
              <TradingTokenContainer asset={asset} />
            </div>
            <div className="col-8">
              <TradingViewChart asset={asset} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
