import React, { useState } from 'react';

import { TransitionContainer } from './index';

export default {
  title: 'Atoms/TransitionContainer',
  component: TransitionContainer,
};

export const Basic = ({ animateHeight = true }) => {
  const [active, setActive] = useState(0);
  return (
    <TransitionContainer active={active} animateHeight={animateHeight}>
      {active === 0 && (
        <button
          className="tw-p-8 tw-text-black tw-bg-primary"
          onClick={() => setActive(1)}
        >
          Alpha
        </button>
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
          onClick={() => setActive(0)}
        >
          Gamma
        </button>
      )}
    </TransitionContainer>
  );
};
