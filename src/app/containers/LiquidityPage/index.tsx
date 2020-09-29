/**
 *
 * LiquidityPage
 *
 */

import React, { useCallback, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useIsConnected } from '../../hooks/useAccount';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Button, InputGroup } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { useApproveAndAddLiquidity } from '../../hooks/amm/useApproveAndAddLiquidity';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';

interface Props {}

export function LiquidityPage(props: Props) {
  const isConnected = useIsConnected();

  const tokens = AssetsDictionary.list().map(item => ({
    key: item.asset,
    label: item.symbol,
  }));

  const [token, setToken] = useState(tokens[0].key);
  const [amount, setAmount] = useState('0');

  const weiAmount = useWeiAmount(amount);

  const tx = useApproveAndAddLiquidity(token, weiAmount, '1');

  const handleSupply = useCallback(() => {
    tx.deposit();
  }, [tx]);

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h2 className="text-center mb-5">Liquidity</h2>
          {!isConnected && <p>Please connect to your wallet first.</p>}
          {isConnected && (
            <div className="row">
              <div className="col-lg-6 offset-lg-3">
                <div className="bg-secondary p-3">
                  <div className="d-flex flex-row justify-content-between">
                    <div className="flex-grow-1 mr-3">
                      <InputGroup
                        className="mb-0"
                        value={amount}
                        onChange={e => setAmount(e.currentTarget.value)}
                        placeholder="Enter trade amount"
                      />
                      {/*{parseFloat(amount) > 0 && !loading && !valid && (*/}
                      {/*  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>*/}
                      {/*    Trade amount exceeds balance*/}
                      {/*  </div>*/}
                      {/*)}*/}
                    </div>
                    <div>
                      <FormSelect
                        filterable={false}
                        items={tokens}
                        onChange={item => setToken(item.key)}
                        value={token}
                      />
                    </div>
                  </div>

                  <Button
                    text="Supply"
                    onClick={handleSupply}
                    loading={tx.loading}
                    disabled={tx.loading}
                  />

                  {tx.type !== 'none' && (
                    <div className="mb-4">
                      <SendTxProgress
                        status={tx.status}
                        txHash={tx.txHash}
                        loading={tx.loading}
                        type={tx.type}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
