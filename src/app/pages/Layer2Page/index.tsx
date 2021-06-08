/**
 *
 * Layer2Page
 *
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { Button } from 'app/components/Form/Button';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { Asset } from '../../../types';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { bignumber } from 'mathjs';
import { useSendContractTx } from '../../hooks/useSendContractTx';
import { TxFeeCalculator } from '../MarginTradePage/components/TxFeeCalculator';
import { useAccount } from '../../hooks/useAccount';
import { toWei } from '../../../utils/blockchain/math-helpers';
import { TxDialog } from '../../components/Dialogs/TxDialog';
import { TxType } from '../../../store/global/transactions-store/types';

interface Props {}

export function Layer2Page(props: Props) {
  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const balance = useAssetBalanceOf(Asset.RBTC);
  const account = useAccount();

  const valid = useMemo(() => {
    return (
      bignumber(balance.value).greaterThanOrEqualTo(weiAmount) &&
      bignumber(weiAmount).greaterThanOrEqualTo(toWei(0.0001))
    );
  }, [weiAmount, balance.value]);

  const { send, ...tx } = useSendContractTx('layer2Inbox', 'depositEth');

  const handleSubmit = useCallback(() => {
    send([account], { value: weiAmount }, { type: TxType.LAYER2_DEPOSIT_ETH });
  }, [account, send, weiAmount]);

  return (
    <>
      <Helmet>
        <title>Sovryn Layer 2</title>
      </Helmet>
      <Header />

      <div className="container" role="main">
        <h1 className="tw-mt-12 tw-mb-3 tw-text-center">Layer 2</h1>
        <p className="tw-text-center tw-mb-12">
          Just a demo page for transferring from layer 1 to layer 2.
        </p>

        <div className="tw-mw-320 tw-bg-black tw-rounded-lg tw-mx-auto p-3">
          <FormGroup label="Amount">
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={Asset.RBTC}
            />
          </FormGroup>

          <TxFeeCalculator
            args={[account]}
            methodName="depositEth"
            contractName="layer2Inbox"
            txConfig={{ value: weiAmount }}
            condition={!!account}
          />

          <Button
            text="Transfer"
            disabled={!valid || tx.loading}
            loading={tx.loading}
            onClick={handleSubmit}
          />

          <TxDialog tx={tx} />
        </div>
      </div>

      <Footer />
    </>
  );
}
