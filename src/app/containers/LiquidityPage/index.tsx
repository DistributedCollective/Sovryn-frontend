/**
 *
 * LiquidityPage
 *
 */

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useIsConnected } from '../../hooks/useAccount';
import { LiquidityAddContainer } from '../LiquidityAddContainer';
import { LiquidityRemoveContainer } from '../LiquidityRemoveContainer';

interface Props {}

export function LiquidityPage(props: Props) {
  const isConnected = useIsConnected();

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h2 className="text-center mb-5">Liquidity</h2>
          {!isConnected && <p>Please connect to your wallet first.</p>}
          {isConnected && (
            <div className="row">
              <div className="col-lg-6">
                <LiquidityAddContainer />
              </div>
              <div className="col-lg-6 mt-3 mt-lg-0">
                <LiquidityRemoveContainer />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
