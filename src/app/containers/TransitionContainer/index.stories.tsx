import React, { useCallback, useState } from 'react';

import { TransitionContainer, TransitionAnimation } from './index';

export default {
  title: 'Atoms/TransitionContainer',
  component: TransitionContainer,
};

export const Basic = ({ animateHeight = true, animation }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="tw-w-80 tw-p-4 tw-mx-auto tw-bg-gray-3 tw-rounded-xl">
      <TransitionContainer
        active={active}
        animateHeight={animateHeight}
        animation={animation}
      >
        {active === 0 && (
          <div>
            <button
              className="tw-p-8 tw-text-black tw-bg-primary"
              onClick={() => setActive(1)}
            >
              Alpha
            </button>
            <p>TransitionContainer itself does not include the background.</p>
          </div>
        )}
        {active === 1 && (
          <button
            className="tw-p-24 tw-text-black tw-bg-secondary"
            onClick={() => setActive(0)}
          >
            Beta
          </button>
        )}
      </TransitionContainer>
    </div>
  );
};

const Transitions = [
  TransitionAnimation.slideLeft,
  TransitionAnimation.slideUp,
  TransitionAnimation.slideRight,
  TransitionAnimation.slideDown,
  TransitionAnimation.fade,
];

export const AllTransitions = ({ animateHeight = true }) => {
  const [active, setActive] = useState(0);
  const [animation, setAnimation] = useState(TransitionAnimation.slideLeft);

  const onAnimationComplete = useCallback(() => {
    setAnimation(Transitions[active]);
  }, [active]);

  return (
    <div className="tw-w-80 tw-p-4 tw-mx-auto tw-bg-gray-3 tw-rounded-xl">
      <TransitionContainer
        active={active}
        animateHeight={animateHeight}
        animation={animation}
        onAnimationComplete={onAnimationComplete}
      >
        {active === 0 && (
          <div>
            <button
              className="tw-p-8 tw-text-black tw-bg-primary"
              onClick={() => setActive(1)}
            >
              Alpha
            </button>
            <p>TransitionContainer itself does not include the background.</p>
          </div>
        )}
        {active === 1 && (
          <button
            className="tw-p-16 tw-text-black tw-bg-secondary"
            onClick={() => setActive(2)}
          >
            Beta
          </button>
        )}
        {active === 2 && (
          <button
            className="tw-p-24 tw-text-black tw-bg-sov-white"
            onClick={() => setActive(3)}
          >
            Gamma
          </button>
        )}
        {active === 3 && (
          <button
            className="tw-p-28 tw-text-black tw-bg-trade-long"
            onClick={() => setActive(4)}
          >
            Delta
          </button>
        )}
        {active === 4 && (
          <button
            className="tw-p-20 tw-text-black tw-bg-trade-short"
            onClick={() => setActive(0)}
          >
            Epsilon
          </button>
        )}
      </TransitionContainer>
    </div>
  );
};
