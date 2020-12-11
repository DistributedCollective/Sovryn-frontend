import React, { Dispatch } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Text } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { FastBtcFormState } from '../../types';
import { actions } from '../../slice';
import { prettyTx } from '../../../../../utils/helpers';
import { TradeButton } from '../../../../components/TradeButton';
import { useAccount } from '../../../../hooks/useAccount';

interface Props {
  state: FastBtcFormState;
  dispatch: Dispatch<any>;
}

export function Screen1({ state, dispatch }: Props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[1];

  const address = useAccount();

  return (
    <>
      <h3 className="heading my-4 text-center">{t(s.title)}</h3>
      <div className="btc-address sovryn-border bg-primary p-3">
        <div className="row d-flex flex-nowrap w-100 mx-auto justify-content-between align-items-center">
          {address.length > 0 && (
            <>
              <CopyToClipboard text={address}>
                <Text ellipsize className="pr-2">
                  <div className="d-block d-md-none">
                    {prettyTx(address, 16, 8)}
                  </div>
                  <Text className="d-none d-md-block" ellipsize>
                    {address}
                  </Text>
                </Text>
              </CopyToClipboard>
            </>
          )}
          <div className="address-link flex-shrink-0 flex-grow-0">
            <Button small minimal className="text-white" icon="log-out" />
          </div>
        </div>
      </div>
      <div className="description my-4">
        <p>{t(s.p1)}</p>
        <p>{t(s.p2)}</p>
      </div>
      <TradeButton
        text={t(s.createAddress)}
        disabled={state.generatingAddress || !address}
        loading={state.generatingAddress}
        onClick={() => dispatch(actions.changeReceiverAddress(address))}
      />
    </>
  );
}
