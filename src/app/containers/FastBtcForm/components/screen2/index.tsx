import React, { Dispatch, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon, Text } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { FastBtcFormState } from '../../types';
import { actions } from '../../slice';
import { prettyTx } from '../../../../../utils/helpers';
import { toaster } from '../../../../../utils/toaster';

interface Props {
  state: FastBtcFormState;
  dispatch: Dispatch<any>;
}

export function Screen2({ state, dispatch }: Props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[2];

  useEffect(() => {
    if (!state.depositAddress) {
      dispatch(actions.resetAddresses());
    }
  }, [state.depositAddress, dispatch]);

  return (
    <>
      <p className="pt-3 text-center">{t(s.p1)}</p>
      <div className="row">
        <div className="col-12 col-sm-6">
          <div className="qr-code w-100">
            <div className="text-center">
              <QRCode
                value={state.depositAddress}
                renderAs="svg"
                bgColor="var(--white)"
                fgColor="var(--primary)"
                includeMargin={true}
                className="rounded w-75 h-75"
              />
            </div>
          </div>
          <div className="btcAddress--screen2 bg-secondary py-1 px-3 mt-3 mx-4 rounded cursor-pointer">
            <CopyToClipboard
              text={state.depositAddress}
              onCopy={() =>
                toaster.show(
                  {
                    message: t(translations.fastBtcForm.depositAddressCopied),
                    intent: 'success',
                  },
                  'btc-copy',
                )
              }
            >
              <div className="d-flex flex-row flex-nowrap justify-content-between align-items-center">
                <Text ellipsize>{prettyTx(state.depositAddress, 6, 4)}</Text>
                <div className="ml-3">
                  <Icon icon="duplicate" />
                </div>
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="col-12 mt-4 col-sm-6 mt-md-0">
          <div className="mb-2">
            <strong className="mb-2 d-block">
              <u>{t(s.depositRequirements)}:</u>
            </strong>
            <ul>
              <li>
                {t(translations.common.min)}: {state.minDepositAmount} BTC
              </li>
              <li>
                {t(translations.common.max)}: {state.maxDepositAmount} BTC
              </li>
              {/*<li>*/}
              {/*  {t(s.fee)} 1.00 USD*{' '}*/}
              {/*  <span className="small">*/}
              {/*    <em>{t(s.feeExplainer)}</em>*/}
              {/*  </span>*/}
              {/*</li>*/}
            </ul>
          </div>
          <div>
            <strong className="mb-2 d-block">
              <u>{t(s.important)}:</u>
            </strong>
            <ul>
              <li>{t(s.important1)}</li>
              <li>{t(s.important2)}</li>
            </ul>
          </div>
          <p>
            {t(s.contactUs)}{' '}
            <a
              href="https://discord.com/invite/J22WS6z"
              target="_blank"
              rel="noreferrer noopener"
            >
              discord.
            </a>
          </p>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-end">
        <div className="sovryn-border small p-2 d-flex flex-row justify-content-between align-items-center">
          {t(s.txDetected)}
          <div
            className={`ml-3 circle circle-${
              state.depositTx?.txHash ? 'green' : 'red'
            }`}
          />
        </div>
      </div>
    </>
  );
}
