import React, { useState } from 'react';
import wMetamask from 'assets/wallets/metamask.svg';
import { SelectItem } from '../SelectItem';

type Props = {
  nextStep: Function;
};

export function Confirm({ nextStep }: Props) {
  const [step, setStep] = useState(1);
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        {step === 1 ? 'Allow ' : 'Confirm '}
        Transaction
      </div>
      <div>
        <div className="tw-mb-10">
          <SelectItem
            className="tw-mx-auto"
            onClick={() => {
              if (step === 1) return setStep(2);
              nextStep();
            }}
          >
            <img
              className="tw-mb-2 tw-mt-2 tw-w-20"
              src={wMetamask}
              alt="metamask"
            />
            Metamask
          </SelectItem>
        </div>
        <div className="tw-text-center" style={{ maxWidth: 300 }}>
          {step === 1
            ? 'Please approve RBTC tokens to be spent from the Sovryn smart contracts'
            : 'Please confirm the trade transaction in your browser wallet'}
        </div>
      </div>
    </div>
  );
}
