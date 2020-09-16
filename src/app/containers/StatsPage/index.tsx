/**
 *
 * StatsPage
 *
 */

import React, { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { StatsRow } from '../../components/StatsRow';

import { AssetsDictionary } from 'utils/blockchain/assets-dictionary';

import { useDrizzle } from '../../hooks/useDrizzle';
import { useDrizzleState } from '../../hooks/useDrizzleState';

export function StatsPage() {
  const assets = AssetsDictionary.assetList();
  const [btcContractData, setBtcContractData] = useState();
  const [usdContractData, setUsdContractData] = useState();
  const initialized = useDrizzleState(state => state.drizzleStatus.initialized);
  const drizzle = useDrizzle();

  useEffect(() => {
    if (initialized) {
      setBtcContractData(drizzle.contracts['Bitcoin_lending']);
      setUsdContractData(drizzle.contracts['USD_lending']);
    }
  }, [initialized, drizzle]);

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h1>Stats</h1>
          <table className="table table-border text-white">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Total Value Lent</th>
                <th>Total Supply (USD)</th>
                <th>Total Supply (Asset)</th>
                <th>Total Borrowed</th>
                <th>Total Available</th>
                <th>Supply APR</th>
                <th>Borrow APR</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <StatsRow
                  asset={asset}
                  key={asset}
                  contract={asset === 'BTC' ? btcContractData : usdContractData}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
