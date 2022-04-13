import React, { Suspense } from 'react';
import { Dialog as BPDialog } from '@blueprintjs/core';
import { ComponentSkeleton } from '../../components/PageSkeleton';
import styles from './dialog.module.scss';
import classNames from 'classnames';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isCloseButtonShown?: boolean;
  children: React.ReactNode;
  canEscapeKeyClose?: boolean;
  canOutsideClickClose?: boolean;
  className?: string;
  dataAttribute?: string;
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  isCloseButtonShown = true,
  children,
  canEscapeKeyClose,
  canOutsideClickClose,
  className = styles.dialog,
  dataAttribute,
}) => (
  <BPDialog
    isOpen={isOpen}
    onClose={onClose}
    canEscapeKeyClose={canEscapeKeyClose}
    canOutsideClickClose={canOutsideClickClose}
    className={classNames(styles.dialog, className)}
  >
    {isCloseButtonShown && (
      <button
        data-action-id={dataAttribute}
        data-close
        className="dialog-close"
        onClick={onClose}
      >
        <span className="tw-sr-only">Close Dialog</span>
      </button>
    )}
    <Suspense fallback={<ComponentSkeleton lines={4} />}>{children}</Suspense>
  </BPDialog>
);
