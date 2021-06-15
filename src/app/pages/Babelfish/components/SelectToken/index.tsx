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
  const selectToken = (token, icon) => {
    setToken({
      title: token,
      icon: (
        <img
          className={
            'tw-object-contain tw-h-full tw-w-full tw-rounded-full tw-bg-white'
          }
          src={icon}
          alt={token}
        />
      ),
    });
  };
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select stablecoin to deposit
      </div>
      <div className="tw-flex tw-gap-10 tw-px-2">
        <SelectItem onClick={() => selectToken('USDT', usdtIcon)}>
          <img className="tw-mb-5 tw-mt-2" src={usdtIcon} alt="USDT" />
          100,000.00 USDT
        </SelectItem>

        <SelectItem onClick={() => selectToken('DAI', daiIcon)}>
          <img className="tw-mb-5 tw-mt-2" src={daiIcon} alt="DAI" />
          100,000.00 DAI
        </SelectItem>

        <SelectItem onClick={() => selectToken('USDC', usdcIcon)} disabled>
          <img className="tw-mb-5 tw-mt-2" src={usdcIcon} alt="USDC" />0 USDC
        </SelectItem>

        <SelectItem onClick={() => selectToken('BUSD', busdIcon)} disabled>
          <img className="tw-mb-5 tw-mt-2" src={busdIcon} alt="BUSD" />0 BUSD
        </SelectItem>
      </div>
    </div>
  );
}
