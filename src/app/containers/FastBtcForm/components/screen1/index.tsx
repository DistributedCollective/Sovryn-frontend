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
      <h3 className="heading tw-my-4 tw-text-center">{t(s.title)}</h3>
      <div className="btc-address sovryn-border bg-primary tw-p-3">
        <div className="row tw-flex tw-flex-nowrap tw-w-full tw-mx-auto tw-justify-between tw-items-center">
          {address.length > 0 && (
            <>
              <CopyToClipboard text={address}>
                <Text ellipsize className="tw-pr-2">
                  <div className="tw-block md:tw-hidden">
                    {prettyTx(address, 16, 8)}
                  </div>
                  <Text className="tw-hidden md:tw-block" ellipsize>
                    {address}
                  </Text>
                </Text>
              </CopyToClipboard>
            </>
          )}
          <div className="address-link tw-flex-shrink-0 tw-flex-grow-0">
            <Button small minimal className="tw-text-white" icon="log-out" />
          </div>
        </div>
      </div>
      <div className="description tw-my-4">
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
