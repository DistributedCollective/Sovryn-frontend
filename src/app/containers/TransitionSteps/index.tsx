import React, { useCallback, useEffect, useState } from 'react';
import { usePrevious } from '../../hooks/usePrevious';
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
  classNameOuter?: string;
  classNameInner?: string;
  steps: {
    [key in I]: TransitionStep<I>;
  };
  active: I;
  defaultAnimation: TransitionAnimation;
};

export const TransitionSteps = <I extends string | number>({
  classNameOuter,
  classNameInner,
  steps,
  active: outsideActive,
  defaultAnimation,
}: TransitionStepsProps<I>) => {
  const previousOutsideActive = usePrevious(outsideActive);
  const [active, setActive] = useState(outsideActive);
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

  useEffect(() => {
    if (
      outsideActive &&
      outsideActive !== active &&
      outsideActive !== previousOutsideActive
    ) {
      changeTo(outsideActive);
    }
  }, [outsideActive, active, previousOutsideActive, changeTo]);

  const Step: TransitionStep<I> = steps[active];

  return (
    <TransitionContainer
      classNameOuter={classNameOuter}
      classNameInner={classNameInner}
      active={active}
      animateHeight
      animation={animation}
    >
      {Step && <Step id={active} changeTo={changeTo} />}
    </TransitionContainer>
  );
};
