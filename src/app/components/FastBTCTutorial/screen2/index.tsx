import React from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '@blueprintjs/core';

export function Screen2(props) {
  return (
    <>
      <p className="pt-3">
        Your unique BTC address has been created, transfer BTC to receive RBTC
        in your RSK wallet
      </p>
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
          <p>
            <strong>Deposit requirements:</strong>
            <ul>
              <li>min: 0.001 BTC</li>
              <li>max: 0.01632829 BTC</li>
              <li>Fee 1.00 USD*</li>
            </ul>
          </p>
          <p>
            <strong>Important:</strong>
            <ul>
              <li>
                Do not deposit any non - BTC assets to this address, otherwise
                your assets will be lost permanently
              </li>
              <li>Please allow upto 15 mins for the transaction to process</li>
            </ul>
          </p>
          <p>
            For support please join us on{' '}
            <a href="discord.com/invite/J22WS6z">discord.com/invite/J22WS6z</a>
          </p>
          <p className="small">*Fee is deducted from the transaction amount</p>
        </div>
      </div>
      <div className="float-right">
        <div className="sovryn-border small p-2">
          Transaction detected
          <div
            className={`ml-2 d-inline-block circle-${
              props.transactionDetected ? 'green' : 'red'
            }`}
          ></div>
        </div>
      </div>
    </>
  );
}
