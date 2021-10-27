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
  enterActive: classNames(styles[`${animation}EnterActive`], styles.animating),
  enterDone: styles[`${animation}EnterDone`],
  exit: styles[`${animation}Exit`],
  exitActive: classNames(styles[`${animation}ExitActive`], styles.animating),
  exitDone: styles[`${animation}ExitDone`],
});

const AnimationConfig: {} = {
  fade: {
    classNames: classNamesForAnimation('fade'),
  },
  slideLeft: {
    classNames: classNamesForAnimation('slideLeft'),
  },
  slideRight: {
    classNames: classNamesForAnimation('slideRight'),
  },
  slideUp: {
    classNames: classNamesForAnimation('slideUp'),
  },
  slideDown: {
    classNames: classNamesForAnimation('slideDown'),
  },
};

type TransitionContainerProps = {
  active: number | string;
  classNameOuter?: string;
  classNameInner?: string;
  children: React.ReactNode;
  animateHeight?: boolean;
  animation?: TransitionAnimation;
  onAnimationComplete?: () => void;
};

const ANIMATION_DURATION = 500;

export const TransitionContainer: React.FC<TransitionContainerProps> = ({
  classNameOuter,
  classNameInner,
  active,
  children,
  animateHeight = true,
  animation = TransitionAnimation.fade,
  onAnimationComplete,
}) => {
  const { ref, dimensions } = useResizeObserver<HTMLDivElement>();

  const animationConfig = AnimationConfig[animation];

  return (
    <div
      className={classNames(
        'tw-relative tw-w-full tw-overflow-hidden',
        classNameOuter,
      )}
      style={{
        minHeight: dimensions?.height,
        transition: animateHeight
          ? `min-height ease-in-out ${ANIMATION_DURATION}ms`
          : undefined,
      }}
    >
      <TransitionGroup>
        <CSSTransition
          key={active}
          classNames={animationConfig.classNames}
          timeout={{ enter: ANIMATION_DURATION, exit: ANIMATION_DURATION }}
          onEntered={onAnimationComplete}
        >
          <div
            ref={ref}
            className={classNames(
              'tw-absolute tw-w-full tw-overflow-hidden',
              classNameInner,
            )}
          >
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
