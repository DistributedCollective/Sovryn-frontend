import React, { useCallback, useState } from 'react';
import {
  TransitionAnimation,
  TransitionContainer,
} from '../TransitionContainer';

type TransitionStepProps<I> = {
  id: I;
  changeTo: (id: I, animation?: TransitionAnimation) => void;
};

export type TransitionStep<I extends string | number> = React.FC<
  TransitionStepProps<I>
>;

export type TransitionStepsProps<I extends string | number> = {
  steps: {
    [key in I]: TransitionStep<I>;
  };
  defaultActive: I;
  defaultAnimation: TransitionAnimation;
  duration?: number;
};

export const TransitionSteps = <I extends string | number>({
  steps,
  defaultActive,
  defaultAnimation,
  duration,
}: TransitionStepsProps<I>) => {
  const [active, setActive] = useState(defaultActive);
  const [animation, setAnimation] = useState(defaultAnimation);

  const changeTo = useCallback<TransitionStepProps<I>['changeTo']>(
    (id, animation = defaultAnimation) => {
      if (!steps[id]) {
        return;
      }
      setAnimation(animation);
      setTimeout(() => setActive(id), 0);
    },
    [steps, defaultAnimation],
  );

  const Step: TransitionStep<I> = steps[active];

  return (
    <TransitionContainer
      active={active}
      animateHeight
      animation={animation}
      duration={duration}
    >
      {Step && <Step id={active} changeTo={changeTo} />}
    </TransitionContainer>
  );
};
