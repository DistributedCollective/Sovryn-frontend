/**
 *
 * SwapTradeForm
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '../../components/FieldGroup';
import { FormSelect } from '../../components/FormSelect';
import { AmountField } from '../AmountField';
import { weiTo18, weiToFixed } from '../../../utils/blockchain/math-helpers';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { TradeButton } from '../../components/TradeButton';
import { Asset } from '../../../types/asset';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { useIsConnected } from '../../hooks/useAccount';
import { translations } from 'locales/i18n';
import { DummyField } from '../../components/DummyField';
import { LoadableValue } from '../../components/LoadableValue';

const s = translations.swapTradeForm;

interface Props {}

const color = 'var(--teal)';

export function SwapTradeForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const isConnected = useIsConnected();

  const [amount, setAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(Asset.BTC);
  const tokens = [];

  const weiAmount = useWeiAmount(amount);

  const { value: tokenBalance } = useTokenBalanceOf(sourceToken);

  return (
    <>
      <FieldGroup label={t(s.fields.tradeAmount)} labelColor={color}>
        <AmountField
          onChange={value => setAmount(value)}
          onMaxClicked={() => setAmount(weiTo18(tokenBalance))}
          value={amount}
        />
      </FieldGroup>

      <div className="position-relative">
        <div className="row">
          <div className="col-4 pr-1">
            <FieldGroup label={t(s.fields.currency)} labelColor={color}>
              <FormSelect
                onChange={value => setSourceToken(value.key)}
                placeholder={t(s.fields.currency_placeholder)}
                value={sourceToken}
                items={tokens}
              />
            </FieldGroup>
          </div>
          <div className="col-8 pl-1">
            <FieldGroup label={t(s.fields.receive)} labelColor={color}>
              <DummyField>
                <LoadableValue
                  value={<>{weiToFixed('0', 8)}</>}
                  loading={false}
                />
              </DummyField>
            </FieldGroup>
          </div>
        </div>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <AssetWalletBalance asset={sourceToken} />
          <TradeButton
            text={t(s.buttons.submit)}
            onClick={() => {}}
            disabled={!isConnected /* || loading || !valid*/}
            textColor={color}
          />
        </div>

        {/*<div>*/}
        {/*  <SendTxProgress*/}
        {/*    status={status}*/}
        {/*    txHash={txHash}*/}
        {/*    loading={loading}*/}
        {/*    type={type}*/}
        {/*    position={position}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </>
  );
}
