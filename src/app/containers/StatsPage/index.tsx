/**
 *
 * StatsPage
 *
 */

import React from 'react';
import { LendingPoolDictionary } from 'utils/lending-pool-dictionary';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { StatsRow } from '../../components/StatsRow';

export function StatsPage() {
  const assets = LendingPoolDictionary.assetList();
  return (
    <>
      <Header />
      <main>
        <div className="container mt-5">
          <div className="sovryn-table mt-5 mb-5">
            <table className="w-100">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Total Asset Supplied</th>
                  <th>Total Asset Borrowed</th>
                  <th>Total Available</th>
                  <th>Supply APR</th>
                  <th>Borrow APR</th>
                </tr>
              </thead>
              <tbody className="mt-5">
                {assets.map(asset => (
                  <StatsRow asset={asset} key={asset} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
