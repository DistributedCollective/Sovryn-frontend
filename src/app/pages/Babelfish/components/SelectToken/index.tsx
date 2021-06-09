import React from 'react';
import usdtIcon from 'assets/images/babelfish/USDT.svg';
import usdcIcon from 'assets/images/babelfish/USDC.svg';
import daiIcon from 'assets/images/babelfish/DAI.svg';
import busdIcon from 'assets/images/babelfish/BUSD.svg';
import { SelectItem } from '../SelectItem';

type Props = {
  setToken: Function;
};
export function SelectToken({ setToken }: Props) {
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select stablecoin to deposit
      </div>
      <div className="tw-flex tw-gap-10 tw-px-2">
        <SelectItem onClick={() => setToken('USDT')}>
          <img className="tw-mb-5" src={usdtIcon} alt="USDT" />
          100,000.00 USDT
        </SelectItem>

        <SelectItem onClick={() => setToken('DAI')}>
          <img className="tw-mb-5" src={daiIcon} alt="DAI" />
          100,000.00 DAI
        </SelectItem>

        <SelectItem onClick={() => setToken('USDC')} disabled>
          <img className="tw-mb-5" src={usdcIcon} alt="USDC" />0 USDC
        </SelectItem>

        <SelectItem onClick={() => setToken('BUSD')} disabled>
          <img className="tw-mb-5" src={busdIcon} alt="BUSD" />0 BUSD
        </SelectItem>
      </div>
    </div>
  );
}
