import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from '@blueprintjs/core';

export function Screen1(props) {
  return (
    <>
      <div className="heading my-4">
        <h2>Your Are Connected!</h2>
      </div>
      <div className="btc-address sovryn-border bg-primary py-3 pl-2">
        <div className="row d-flex w-100 mx-auto">
          <div className="green-circle mx-1"></div>
          {props.btcAddress.length > 0 && (
            <>
              <CopyToClipboard text={props.btcAddress}>
                <div className="flex-shrink-1">{`${props.btcAddress.substring(
                  0,
                  48,
                )}...`}</div>
              </CopyToClipboard>
            </>
          )}
          <div className="address-link">
            <Button small minimal className="text-white" icon="log-out" />
          </div>
        </div>
      </div>
      <div className="description my-4">
        <p>
          In order to borrow/lend and trade on Sovryn, you must first enable
          your Bitcoin by transferring them to your rsk wallet.
        </p>
        <p>
          You do this by creating a unique btc address that pegs to your RSK
          address, supercharging your BTC into RBTC.
        </p>
      </div>
      <div className="create-button text-center position-absolute">
        <button
          type="button"
          className="btn"
          onClick={() => props.changeScreen(2)}
        >
          <div>Create Address</div>
        </button>
      </div>
    </>
  );
}
