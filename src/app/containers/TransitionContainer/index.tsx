import classNames from 'classnames';
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import styles from './index.module.scss';

export enum TransitionAnimation {
  fade = 'fade',
  slideLeft = 'slideLeft',
  slideRight = 'slideRight',
  slideUp = 'slideUp',
  slideDown = 'slideDown',
}

const classNamesForAnimation = (animation: string) => ({
  enter: styles[`${animation}Enter`],
  enterActive: classNames(styles[`${animation}EnterActive`], styles.disabled),
  enterDone: styles[`${animation}EnterDone`],
  exit: styles[`${animation}Exit`],
  exitActive: classNames(styles[`${animation}ExitActive`], styles.disabled),
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
  animation?: TransitionAnimation;
  onAnimationComplete?: () => void;
};

export const TransitionContainer: React.FC<ITransitionContainerProps> = ({
  active,
  children,
  animateHeight = true,
  duration = 500,
  animation = TransitionAnimation.fade,
  onAnimationComplete,
}) => {
  const { ref, dimensions } = useResizeObserver<HTMLDivElement>();

  const animationConfig = AnimationConfig[animation];

  return (
    <div
      className="tw-relative tw-w-full tw-overflow-hidden"
      style={{
        height: dimensions?.height,
        transition: animateHeight ? `height ease-in-out ${duration}ms` : '',
      }}
    >
      <TransitionGroup>
        <CSSTransition
          key={active}
          classNames={animationConfig.classNames}
          timeout={{ enter: duration, exit: duration }}
          onEntered={onAnimationComplete}
        >
          <div
            ref={ref}
            className="tw-absolute tw-w-full tw-overflow-hidden"
            style={{
              transition: animationConfig.transitionProperties
                .map(prop => `${prop} ease-in-out ${duration}ms`)
                .join(', '),
            }}
          >
            <div>{children}</div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
