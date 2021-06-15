import React from 'react';
import { Button } from 'app/components/Button';

type Props = {
  onClose: Function;
  onConfirm: Function;
};

export function Processing({ onConfirm, onClose }: Props) {
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Deposit in progress...
      </div>
      <div>
        <div className="tw-grid tw-grid-cols-2 tw-gap-y-4">
          <div>Date/Time:</div>
          <span>21/01/21 - 14:34 UTC</span>
          <div>From:</div>
          <span>Ethereum Network</span>
          <div>Token:</div>
          <span>USDT</span>
          <div>Amount:</div>
          <span>10000</span>
          <div>Bridge Fee:</div>
          <span>xxx</span>
          <div>Gas Fee:</div>
          <span>xxx</span>

          <div>Eth Dposit ID:</div>
          <span>xxx</span>

          <div>RSK Relay Hash:</div>
          <span>xxx</span>
        </div>
        <Button
          className="tw-mt-10 tw-w-full"
          text={'Close'}
          onClick={() => onClose()}
        />
      </div>
    </div>
  );
}
