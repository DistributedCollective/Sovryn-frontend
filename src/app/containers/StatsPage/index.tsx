/**
 *
 * StatsPage
 *
 */

import React from 'react';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { StatsRow } from '../../components/StatsRow';

import { AssetsDictionary } from 'utils/blockchain/assets-dictionary';

export function StatsPage() {
  const assets = AssetsDictionary.assetList();

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <table className="table table-dark text-white mt-5">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Total Asset Supplied</th>
                <th>Total Asset Borrowed</th>
                <th>Total Available</th>
                <th>Asset Price</th>
                <th>Supply APR</th>
                <th>Borrow APR</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <StatsRow asset={asset} key={asset} />
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
