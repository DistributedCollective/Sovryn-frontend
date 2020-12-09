import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function Screen2(props) {
  const { t } = useTranslation();
  const s = translations.fastBTC.screens[2];
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
  });

  return (
    <>
      {show && (
        <>
          <p className="pt-3 text-center">{t(s.p1)}</p>
          <div className="row">
            <div className="col-6">
              <div className="qr-code">
                <div className="text-center">
                  <QRCode
                    value={props.btcAddress}
                    renderAs="svg"
                    bgColor="var(--white)"
                    fgColor="var(--primary)"
                    includeMargin={true}
                    size={258}
                    className="rounded"
                  />
                </div>
              </div>
              <div className="btcAddress--screen2 bg-secondary py-1 px-3 mt-3 mx-4 rounded cursor-pointer">
                <CopyToClipboard text={props.btcAddress}>
                  <div className="d-inline">{`${props.btcAddress.substring(
                    0,
                    24,
                  )}...`}</div>
                </CopyToClipboard>
                <div className="d-inline">
                  <Icon icon="duplicate" />
                </div>
              </div>
            </div>
            <div className="col-6">
              <p className="mb-2">
                <strong className="mb-2 d-block">
                  <u>{t(s.depositRequirements)}:</u>
                </strong>
                <ul>
                  <li>{t(translations.common.min)}: 0.001 BTC</li>
                  <li>{t(translations.common.max)}: 0.01632829 BTC</li>
                  <li>
                    {t(s.fee)} 1.00 USD*{' '}
                    <span className="small">
                      <em>{t(s.feeExplainer)}</em>
                    </span>
                  </li>
                </ul>
              </p>
              <p>
                <strong className="mb-2 d-block">
                  <u>{t(s.important)}:</u>
                </strong>
                <ul>
                  <li>{t(s.important1)}</li>
                  <li>{t(s.important2)}</li>
                </ul>
              </p>
              <p>
                {t(s.contactUs)}{' '}
                <a href="discord.com/invite/J22WS6z">discord.</a>
              </p>
            </div>
          </div>
          <div className="float-right">
            <div className="sovryn-border small p-2">
              {t(s.txDetected)}
              <div
                className={`ml-2 d-inline-block circle-${
                  props.transactionDetected ? 'green' : 'red'
                }`}
              ></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
