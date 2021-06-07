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

  const handleStep = useCallback(
    nextStep => {
      const prvSteps = [...steps];
      if (nextStep > 1) {
        prvSteps[0].value = {
          title: 'Ethereum',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.ETH).logoSvg}
              alt={AssetsDictionary.get(Asset.ETH).name}
            />
          ),
        };
      } else prvSteps[0].value = null;

      if (nextStep > 2) {
        prvSteps[1].value = {
          title: 'USDT',
          icon: (
            <img
              className={'tw-object-contain'}
              src={AssetsDictionary.get(Asset.USDT).logoSvg}
              alt={AssetsDictionary.get(Asset.USDT).name}
            />
          ),
        };
      } else prvSteps[1].value = null;

      if (nextStep > 3) {
        prvSteps[2].value = {
          title: '1000.00',
          icon: (
            <img
              className={'tw-object-contain tw-h-3 tw-w-3'}
              src={walletIcon}
              alt="wallet"
            />
          ),
        };
      } else prvSteps[2].value = null;

      setStep(nextStep);
      setSteps(prvSteps);
    },
    [steps],
  );
  return (
    <div className="tw-flex tw-px-10">
      <Stepper steps={steps} step={step} onClick={handleStep} />
    </div>
  );
}
