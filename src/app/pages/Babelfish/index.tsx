/**
 *
 * Babelfish
 *
 */

import React, { useState, useCallback } from 'react';
import { Stepper, StepItem } from './components/Stepper';

import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import walletIcon from 'assets/images/wallet-icon.svg';
import { SelectNetwork } from './components/SelectNetwork';

const initialSteps = [
  'Network',
  'Token',
  'Amount',
  'Review',
  'Confirm',
  'Processing',
  'Complete',
];

export function Babelfish() {
  const [step, setStep] = useState(1);
  const [steps, setSteps] = useState<StepItem[]>(
    initialSteps.map(title => ({ title })),
  );
  const updateStep = useCallback(
    (index, value) => {
      const prvSteps = [...steps];
      prvSteps[index].value = value;

      setSteps(prvSteps);
    },
    [steps],
  );
  const setNetwork = (network: string) => {
    switch (network) {
      case 'ETH':
        updateStep(0, {
          title: 'Ethereum',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.ETH).logoSvg}
              alt={AssetsDictionary.get(Asset.ETH).name}
            />
          ),
        });
        break;
      case 'BSC':
        updateStep(0, {
          title: 'Binance Chain',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.ETH).logoSvg}
              alt={AssetsDictionary.get(Asset.ETH).name}
            />
          ),
        });
        break;
    }
    setStep(2);
  };
  const handleStep = useCallback(
    nextStep => {
      if (nextStep > 1) {
        updateStep(0, {
          title: 'Ethereum',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.ETH).logoSvg}
              alt={AssetsDictionary.get(Asset.ETH).name}
            />
          ),
        });
      } else updateStep(0, null);

      if (nextStep > 2) {
        updateStep(1, {
          title: 'USDT',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.USDT).logoSvg}
              alt={AssetsDictionary.get(Asset.USDT).name}
            />
          ),
        });
      } else updateStep(1, null);

      if (nextStep > 3) {
        updateStep(2, {
          title: '1000.00',
          icon: (
            <img
              className={'tw-object-contain tw-h-3 tw-w-3'}
              src={walletIcon}
              alt="wallet"
            />
          ),
        });
      } else updateStep(2, null);

      setStep(nextStep);
    },
    [updateStep],
  );
  return (
    <div className="tw-flex tw-px-10 tw-h-full">
      <div
        className="tw-h-full tw-flex tw-items-center"
        style={{ minWidth: 300 }}
      >
        <Stepper steps={steps} step={step} onClick={handleStep} />
      </div>
      <div className="tw-flex-1 tw-flex tw-justify-center tw-items-center">
        {step === 1 && <SelectNetwork setNetwork={setNetwork} />}
      </div>
    </div>
  );
}
