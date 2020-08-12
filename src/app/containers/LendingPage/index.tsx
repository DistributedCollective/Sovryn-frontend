/**
 *
 * LendingPage
 *
 */

import React from 'react';
import { LendingTokenSelectorCard } from 'app/components/LendingTokenSelectorCard';
import { createDrizzle } from 'utils/blockchain/createDrizzle';
import { Asset } from 'types/asset';

import { DrizzleProvider } from '../DrizzleProvider';

const drizzle = createDrizzle([
  'LoadContractRBTC',
  'LoanContractSUSD',
  'TestTokenRBTC',
  'TestTokenSUSD',
]);

interface Props {}

export function LendingPage(props: Props) {
  return (
    <DrizzleProvider drizzle={drizzle}>
      <div className="container py-5">
        <div className="row">
          <div className="col-6">
            <LendingTokenSelectorCard asset={Asset.BTC} />
          </div>
          <div className="col-6">
            <LendingTokenSelectorCard asset={Asset.USD} />
          </div>
        </div>
      </div>
    </DrizzleProvider>
  );
}
