import React, { useState } from 'react';
import cn from 'classnames';
// import styled from 'styled-components/macro';

interface Props {}

export function Stepper(props: Props) {
  const [step, setStep] = useState(1);
  return (
    <div>
      <ul className="tw-relative">
        <Step
          title="Network"
          current={step === 1}
          active={step >= 1}
          onClick={() => setStep(1)}
        />
        <Step
          title="Token"
          active={step >= 2}
          current={step === 2}
          onClick={() => setStep(2)}
        />
        <Step
          title="Amount"
          active={step >= 3}
          current={step === 3}
          onClick={() => setStep(3)}
        />
        <Step
          title="Review"
          active={step >= 4}
          current={step === 4}
          onClick={() => setStep(4)}
        />
        <Step
          title="Confirm"
          active={step >= 5}
          current={step === 5}
          onClick={() => setStep(5)}
        />
        <Step
          title="Processing"
          active={step >= 6}
          current={step === 6}
          onClick={() => setStep(6)}
        />
        <Step
          title="Complete"
          active={step >= 7}
          current={step === 7}
          isLast
          onClick={() => setStep(7)}
        />
      </ul>
    </div>
  );
}

interface StepProps {
  title: string;
  current?: Boolean;
  value?: any;
  active?: Boolean;
  isLast?: Boolean;
  onClick: Function;
}

function Step({ title, current, value, active, isLast, onClick }: StepProps) {
  return (
    <li
      className={cn(
        'tw-flex tw-items-center tw-mb-10 tw-pt-1.5 tw-transition tw-duration-200 tw-ease-in-out tw-cursor-pointer',
        {
          'tw-opacity-50': !value && !current && !active,
        },
      )}
      onClick={() => onClick()}
    >
      <span
        className={cn(
          'tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-transform tw--ml-1 tw-relative mr-4 tw-transition tw-duration-200 tw-ease-in-out',
          { 'tw-border-white': current, 'tw-border-transparent': !current },
        )}
      >
        {!isLast && (
          <span
            className="tw-h-9 bg-white tw-absolute tw--bottom-1.5 tw-left-0 tw-right-0 tw-mx-auto tw-transform tw-translate-y-full tw--translate-x-1/2"
            style={{ width: 1 }}
          ></span>
        )}
        {!value && (
          <span
            className={cn(
              'tw-border-white tw-w-2 tw-h-2 tw-rounded-full tw-bg-white tw-inline-block tw-transition tw-duration-200 tw-ease-in-out',
              { 'tw-transform tw-scale-125': !!active },
            )}
          ></span>
        )}
      </span>
      {title}
    </li>
  );
}
