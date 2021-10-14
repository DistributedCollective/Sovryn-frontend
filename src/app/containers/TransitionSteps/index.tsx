import React, { useCallback, useMemo, useState } from 'react';
import { usePrevious } from '../../hooks/usePrevious';
import {
  TransitionAnimation,
  TransitionContainer,
} from '../TransitionContainer';

type TransitionStep = {
  id: number | string;
  component: React.ReactNode;
};

export type ITransitionStepsProps = {
  steps: TransitionStep[];
  active: number | string;
  animationForwards: TransitionAnimation;
  animationBackwards: TransitionAnimation;
};

export const TransitionSteps: React.FC<ITransitionStepsProps> = ({
  steps,
  active,
  animationForwards,
  animationBackwards,
}) => {
  const previous = usePrevious(active);
  const stepIndex = useMemo(() => steps.findIndex(step => step.id === active), [
    active,
    steps,
  ]);
  const previousIndex = useMemo(
    () => steps.findIndex(step => step.id === previous),
    [previous, steps],
  );

  return (
    <TransitionContainer
      active={active}
      animateHeight
      animation={
        stepIndex < previousIndex ? animationBackwards : animationForwards
      }
    >
      {steps[stepIndex]?.component}
    </TransitionContainer>
  );
};
