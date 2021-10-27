import React from 'react';
import { TransitionAnimation } from '../TransitionContainer';

import { TransitionStep, TransitionSteps } from './index';

export default {
  title: 'Atoms/TransitionSteps',
  component: TransitionSteps,
};

enum Steps {
  alpha = 'alpha',
  beta = 'beta',
}

const TestStep: TransitionStep<Steps> = ({ changeTo, id }) => (
  <div className="tw-p-16">
    <h3>{id}</h3>
    <button
      className="tw-w-full tw-p-8 tw-text-black tw-bg-trade-long"
      onClick={() =>
        changeTo(
          id === Steps.alpha ? Steps.beta : Steps.alpha,
          TransitionAnimation.slideUp,
        )
      }
    >
      Up
    </button>
    <button
      className="tw-w-1/2 tw-p-8 tw-text-black tw-bg-secondary"
      onClick={() =>
        changeTo(
          id === Steps.alpha ? Steps.beta : Steps.alpha,
          TransitionAnimation.slideLeft,
        )
      }
    >
      Left
    </button>
    <button
      className="tw-w-1/2 tw-p-8 tw-text-black tw-bg-primary"
      onClick={() =>
        changeTo(
          id === Steps.alpha ? Steps.beta : Steps.alpha,
          TransitionAnimation.slideRight,
        )
      }
    >
      Right
    </button>
    <button
      className="tw-w-full tw-p-8 tw-text-black tw-bg-trade-short"
      onClick={() =>
        changeTo(
          id === Steps.alpha ? Steps.beta : Steps.alpha,
          TransitionAnimation.slideDown,
        )
      }
    >
      Down
    </button>
    {id === Steps.alpha && (
      <p className="tw-mt-8">
        TransitionSteps itself does not incude the background.
      </p>
    )}
  </div>
);

export const Basic = () => {
  return (
    <div className="tw-max-w-lg tw-w-full tw-mx-auto tw-bg-gray-3 tw-rounded-xl">
      <TransitionSteps<Steps>
        active={Steps.alpha}
        defaultAnimation={TransitionAnimation.fade}
        steps={{
          [Steps.alpha]: TestStep,
          [Steps.beta]: TestStep,
        }}
      ></TransitionSteps>
    </div>
  );
};
