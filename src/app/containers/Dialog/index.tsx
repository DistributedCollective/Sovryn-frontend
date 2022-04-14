import React, { Suspense } from 'react';
import { Dialog as BPDialog } from '@blueprintjs/core';
import { ComponentSkeleton } from '../../components/PageSkeleton';
import styles from './dialog.module.scss';
import classNames from 'classnames';

export enum DialogSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isCloseButtonShown?: boolean;
  children: React.ReactNode;
  canEscapeKeyClose?: boolean;
  canOutsideClickClose?: boolean;
  className?: string;
  dataAttribute?: string;
  size?: DialogSize;
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  isCloseButtonShown,
  children,
  canEscapeKeyClose,
  canOutsideClickClose,
  className,
  dataAttribute,
  size = DialogSize.sm,
}) => (
  <BPDialog
    isOpen={isOpen}
    onClose={onClose}
    canEscapeKeyClose={canEscapeKeyClose}
    canOutsideClickClose={canOutsideClickClose}
    className={classNames(className, styles[size])}
  >
    {isCloseButtonShown && (
      <button data-close="" className="dialog-close" onClick={onClose}>
        <span className="tw-sr-only">Close Dialog</span>
      </button>
    )}
    <Suspense fallback={<ComponentSkeleton lines={4} />}>{children}</Suspense>
  </BPDialog>
);

Dialog.defaultProps = {
  className: styles.dialog,
  size: DialogSize.sm,
  isCloseButtonShown: true,
  onClose: () => {},
};
