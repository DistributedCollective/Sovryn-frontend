import React from 'react';
import bscIcon from 'assets/images/networks/bsc.svg';
import ethIcon from 'assets/images/networks/eth.svg';
import { SelectItem } from '../SelectItem';

type Props = {
  setNetwork: Function;
};
export function SelectNetwork({ setNetwork }: Props) {
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select Network to deposit from
      </div>
      <div className="tw-flex tw-gap-10 tw-px-2">
        <SelectItem onClick={() => setNetwork('ETH')}>
          <img className="tw-mb-5 tw-mt-2" src={ethIcon} alt="ETH" />
          ETH Network
        </SelectItem>
        <SelectItem onClick={() => setNetwork('BSC')}>
          <img className="tw-mb-5 tw-mt-2" src={bscIcon} alt="BSC" />
          BSC Network
        </SelectItem>
      </div>
    </div>
  );
}
