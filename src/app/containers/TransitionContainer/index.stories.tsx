import React, { useCallback, useState } from 'react';

import { TransitionContainer, TransitionAnimation } from './index';

export default {
  title: 'Atoms/TransitionContainer',
  component: TransitionContainer,
};

const Transitions = [
  TransitionAnimation.slideLeft,
  TransitionAnimation.slideUp,
  TransitionAnimation.slideRight,
  TransitionAnimation.slideDown,
];

export const Basic = ({ animateHeight = true }) => {
  const [active, setActive] = useState(0);
  const [animation, setAnimation] = useState(TransitionAnimation.slideLeft);

  const onAnimationStarted = useCallback(() => {
    setAnimation(Transitions[active]);
  }, [active]);

  return (
    <div className="tw-w-80 tw-p-4 tw-mx-auto tw-bg-gray-3 tw-rounded-xl">
      <TransitionContainer
        active={active}
        animateHeight={animateHeight}
        animation={animation}
        onAnimationStarted={onAnimationStarted}
      >
        {active === 0 && (
          <div>
            <button
              className="tw-p-8 tw-text-black tw-bg-primary"
              onClick={() => setActive(1)}
            >
              Alpha
            </button>
            <p>TransitionContainer itself does not incude the background.</p>
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
            onClick={() => setActive(0)}
          >
            Delta
          </button>
        )}
      </TransitionContainer>
    </div>
  );
};
