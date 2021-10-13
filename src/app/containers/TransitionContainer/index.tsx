import classNames from 'classnames';
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import styles from './index.module.scss';

type ITransitionContainerProps = {
  active: number | string;
  children: React.ReactNode;
  animateHeight?: boolean;
  duration?: number;
};

export const TransitionContainer: React.FC<ITransitionContainerProps> = ({
  active,
  children,
  animateHeight = true,
  duration = 1000,
}) => {
  const { ref, dimensions } = useResizeObserver<HTMLDivElement>();

  return (
    <TransitionGroup>
      <CSSTransition
        key={active}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          enterDone: styles.fadeEnterDone,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
          exitDone: styles.fadeExitDone,
        }}
        timeout={{ enter: duration, exit: duration }}
      >
        <div
          className={classNames(
            'tw-absolute tw-w-full tw-bg-gray-3',
            animateHeight && 'tw-overflow-hidden',
          )}
          style={{
            height: animateHeight ? dimensions?.height : undefined,
            transition: `all ease-in-out ${duration}ms`,
          }}
        >
          <div ref={ref}>{children}</div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
