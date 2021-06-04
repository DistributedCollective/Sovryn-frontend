import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import walletIcon from 'assets/images/wallet-icon.svg';

export function Stepper() {
  const [network, setNetwork] = useState<StepValue | null>(null);
  const [token, setToken] = useState<StepValue | null>(null);
  const [amount, setAmount] = useState<StepValue | null>(null);
  const [step, setStep] = useState(1);
  const handleStep = useCallback(nextStep => {
    if (nextStep > 1) {
      setNetwork({
        title: 'Ethereum',
        icon: (
          <img
            className={'tw-object-contain'}
            src={AssetsDictionary.get(Asset.ETH).logoSvg}
            alt={AssetsDictionary.get(Asset.ETH).name}
          />
        ),
      });
    } else setNetwork(null);

    if (nextStep > 2) {
      setToken({
        title: 'USDT',
        icon: (
          <img
            className={'tw-object-contain'}
            src={AssetsDictionary.get(Asset.USDT).logoSvg}
            alt={AssetsDictionary.get(Asset.USDT).name}
          />
        ),
      });
    } else setToken(null);

    if (nextStep > 3) {
      setAmount({
        title: '1000.00',
        icon: (
          <img
            className={'tw-object-contain tw-h-2.5 tw-w-2.5'}
            src={walletIcon}
            alt="wallet"
          />
        ),
      });
    } else setAmount(null);

    setStep(nextStep);
  }, []);

  return (
    <div>
      <ul className="tw-relative">
        <div className="tw-relative tw-flex">
          <div
            className="lg:tw-mt-0.5 tw-h-full tw-absolute tw-transition-transform tw-duration-200 tw-ease-in-out"
            style={{
              transform: `translateY(${100 * (step - 1)}%)`,
            }}
          >
            <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-mr-4 tw-border-white"></span>
          </div>
          <Step
            title="Network"
            current={step === 1}
            value={network}
            active={step >= 1}
            onClick={() => handleStep(1)}
            isFirst
          />
        </div>

        <Step
          title="Token"
          value={token}
          active={step >= 2}
          current={step === 2}
          onClick={() => handleStep(2)}
        />
        <Step
          title="Amount"
          value={amount}
          active={step >= 3}
          current={step === 3}
          onClick={() => handleStep(3)}
        />
        <Step
          title="Review"
          active={step >= 4}
          current={step === 4}
          onClick={() => handleStep(4)}
        />
        <Step
          title="Confirm"
          active={step >= 5}
          current={step === 5}
          onClick={() => handleStep(5)}
        />
        <Step
          title="Processing"
          active={step >= 6}
          current={step === 6}
          onClick={() => handleStep(6)}
        />
        <Step
          title="Complete"
          active={step >= 7}
          current={step === 7}
          onClick={() => handleStep(7)}
        />
      </ul>
    </div>
  );
}

interface StepValue {
  title: string;
  icon?: React.ReactChild;
}

interface StepProps {
  title: string;
  current?: Boolean;
  value?: StepValue | null;
  active?: Boolean;
  isFirst?: Boolean;
  onClick: Function;
}

function Step({ title, current, value, active, isFirst, onClick }: StepProps) {
  return (
    <li
      className={cn(
        'tw-flex tw-items-center tw-mb-11 tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out',
        {
          'tw-opacity-25': !active,
          'tw-font-bold': current,
        },
      )}
      onClick={() => onClick()}
    >
      <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-transform tw-relative tw-mr-4 tw-border-transparent">
        {!isFirst && (
          <span
            className="tw-h-9 bg-white tw-absolute tw--top-1.5 tw-left-0 tw-right-0 tw-mx-auto tw-transform tw--translate-y-full tw--translate-x-1/2"
            style={{ width: 1 }}
          ></span>
        )}
        <span
          className={cn(
            'tw-absolute tw-border-white tw-w-2 tw-h-2 tw-rounded-full tw-bg-white tw-inline-block tw-transition tw-duration-200 tw-ease-in-out',
            {
              'tw-transform tw-scale-125': !!active,
              'tw-scale-0': value?.icon,
              'tw-scale-100': !value?.icon,
            },
          )}
        ></span>

        <span
          className={cn(
            'tw-absolute tw-flex tw-items-center tw-justify-center tw-transform tw-border-white tw-w-3.5 tw-h-3.5 tw-rounded-full tw-transition tw-duration-200 tw-ease-in-out',
            {
              'tw-scale-0': !value?.icon,
              'tw-scale-125': value?.icon,
            },
          )}
        >
          {value?.icon}
        </span>
      </span>
      {value?.title || title}
    </li>
  );
}
