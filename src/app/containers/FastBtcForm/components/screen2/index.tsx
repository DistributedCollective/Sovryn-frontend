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
      <p className="tw-pt-4 tw-text-center">{t(s.p1)}</p>
      <div className="row">
        <div className="col-12 col-sm-6">
          <div className="qr-code tw-w-full">
            <div className="tw-text-center">
              <QRCode
                value={state.depositAddress}
                renderAs="svg"
                bgColor="var(--white)"
                fgColor="var(--primary)"
                includeMargin={true}
                className="tw-rounded tw-w-3/4 tw-h-3/4"
              />
            </div>
          </div>
          <div className="btcAddress--screen2 bg-secondary tw-py-1 tw-px-4 tw-mt-4 tw-mx-6 tw-rounded tw-cursor-pointer">
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
              <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-between tw-items-center">
                <Text ellipsize>{prettyTx(state.depositAddress, 6, 4)}</Text>
                <div className="tw-ml-4">
                  <Icon icon="duplicate" />
                </div>
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="col-12 tw-mt-6 col-sm-6 md:tw-mt-0">
          <div className="tw-mb-2">
            <strong className="tw-mb-2 tw-block">
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
            <strong className="tw-mb-2 tw-block">
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
      <div className="tw-flex tw-flex-row tw-justify-end">
        <div className="sovryn-border small tw-p-2 tw-flex tw-flex-row tw-justify-between tw-items-center">
          {t(s.txDetected)}
          <div
            className={`tw-ml-4 circle circle-${
              state.depositTx?.txHash ? 'green' : 'red'
            }`}
          />
        </div>
      </div>
    </>
  );
}
