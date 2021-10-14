import classNames from 'classnames';
import React, {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import styles from './index.module.scss';

export enum TransitionContainerAnimation {
  fade = 'fade',
  slideLeft = 'slideLeft',
  slideRight = 'slideRight',
  slideUp = 'slideUp',
  slideDown = 'slideDown',
}

const classNamesForAnimation = (animation: string) => ({
  enter: styles[`${animation}Enter`],
  enterActive: styles[`${animation}EnterActive`],
  enterDone: styles[`${animation}EnterDone`],
  exit: styles[`${animation}Exit`],
  exitActive: styles[`${animation}ExitActive`],
  exitDone: styles[`${animation}ExitDone`],
});

const AnimationConfig: {} = {
  fade: {
    classNames: classNamesForAnimation('fade'),
    transitionProperties: ['opacity'],
  },
  slideLeft: {
    classNames: classNamesForAnimation('slideLeft'),
    transitionProperties: ['transform'],
  },
  slideRight: {
    classNames: classNamesForAnimation('slideRight'),
    transitionProperties: ['transform'],
  },
  slideUp: {
    classNames: classNamesForAnimation('slideUp'),
    transitionProperties: ['transform', 'bottom'],
  },
  slideDown: {
    classNames: classNamesForAnimation('slideDown'),
    transitionProperties: ['transform', 'top'],
  },
};

type ITransitionContainerProps = {
  active: number | string;
  children: React.ReactNode;
  animateHeight?: boolean;
  duration?: number;
  animation?: TransitionContainerAnimation;
  onAnimationStarted?: () => void;
};

export const TransitionContainer: React.FC<ITransitionContainerProps> = ({
  active,
  children,
  animateHeight = true,
  duration = 1000,
  animation = TransitionContainerAnimation.fade,
  onAnimationStarted,
}) => {
  const { ref, dimensions } = useResizeObserver<HTMLDivElement>();

  const animationConfig = AnimationConfig[animation];

  return (
    <div
      className={classNames(
        'tw-relative tw-w-full',
        animateHeight && 'tw-overflow-hidden',
      )}
      style={{
        height: animateHeight ? dimensions?.height : undefined,
        transition: `height ease-in-out ${duration}ms`,
      }}
    >
      <TransitionGroup>
        <CSSTransition
          key={active}
          classNames={animationConfig.classNames}
          timeout={{ enter: duration, exit: duration }}
          onEntering={onAnimationStarted}
        >
          <div
            className={classNames(
              'tw-absolute tw-w-full',
              animateHeight && 'tw-overflow-hidden',
            )}
            style={{
              transition: animationConfig.transitionProperties
                .map(prop => `${prop} ease-in-out ${duration}ms`)
                .join(', '),
            }}
          >
            <div ref={ref}>{children}</div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
