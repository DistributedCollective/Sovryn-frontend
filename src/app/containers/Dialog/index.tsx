import React, { Suspense } from 'react';
import { Dialog as BPDialog } from '@blueprintjs/core';
import { ComponentSkeleton } from '../../components/PageSkeleton';
import styles from '../../components/Dialogs/dialog.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isCloseButtonShown?: boolean;
  children: React.ReactNode;
  canEscapeKeyClose?: boolean;
  canOutsideClickClose?: boolean;
  className?: string;
  dataAttribute?: string;
}

export function Dialog(props: Props) {
  return (
    <BPDialog
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      canEscapeKeyClose={props.canEscapeKeyClose}
      canOutsideClickClose={props.canOutsideClickClose}
      className={props.className}
    >
      {props.isCloseButtonShown && (
        <button
          data-action-id={props.dataAttribute}
          data-close
          className="dialog-close"
          onClick={props.onClose}
        >
          <span className="tw-sr-only">Close Dialog</span>
        </button>
      )}
      <Suspense fallback={<ComponentSkeleton lines={4} />}>
        {props.children}
      </Suspense>
    </BPDialog>
  );
}

Dialog.defaultProps = {
  className: styles.dialog,
  isCloseButtonShown: true,
  onClose: () => {},
};
