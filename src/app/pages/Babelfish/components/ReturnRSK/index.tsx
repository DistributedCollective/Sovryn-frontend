import React from 'react';
import wMetamask from 'assets/wallets/metamask.svg';
import { SelectItem } from '../SelectItem';

export function ReturnRSK() {
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">Connect to RSK</div>
      <div>
        <div className="tw-mb-10">
          <SelectItem className="tw-mx-auto">
            <img
              className="tw-mb-2 tw-mt-2 tw-w-20"
              src={wMetamask}
              alt="metamask"
            />
            Metamask
          </SelectItem>
        </div>
        <div className="tw-text-center" style={{ maxWidth: 300 }}>
          To continue switch back to the RSK network in you MetaMask wallet
        </div>
      </div>
    </div>
  );
}
