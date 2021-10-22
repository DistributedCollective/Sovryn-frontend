import React, { useCallback, useState } from 'react';
import {
  TransitionAnimation,
  TransitionContainer,
} from '../TransitionContainer';

type TransitionStepProps<I, P> = P & {
  id: I;
  changeTo: (id: I, animation?: TransitionAnimation) => void;
};

export type TransitionStep<
  I extends string | number,
  P extends object
> = React.FC<TransitionStepProps<I, P>>;

export type TransitionStepsProps<
  I extends string | number,
  P extends object
> = {
  steps: {
    [key in I]: TransitionStep<I, P>;
  };
  forwardProps: P;
  defaultActive: I;
  defaultAnimation: TransitionAnimation;
  duration?: number;
};

export const TransitionSteps = <I extends string | number, P extends object>({
  steps,
  forwardProps,
  defaultActive,
  defaultAnimation,
  duration,
}: TransitionStepsProps<I, P>) => {
  const [active, setActive] = useState(defaultActive);
  const [animation, setAnimation] = useState(defaultAnimation);

  const changeTo = useCallback<TransitionStepProps<I, any>['changeTo']>(
    (id, animation = defaultAnimation) => {
      if (!steps[id]) {
        return;
      }
      setAnimation(animation);
      setTimeout(() => setActive(id), 0);
    },
    [steps, defaultAnimation],
  );

  const Step: TransitionStep<I, P> = steps[active];

  return (
    <TransitionContainer
      active={active}
      animateHeight
      animation={animation}
      duration={duration}
    >
      {Step && <Step id={active} changeTo={changeTo} {...forwardProps} />}
    </TransitionContainer>
  );
};
