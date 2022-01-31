import React from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { TransakScreen } from './TransakScreen';
import styles from './index.module.scss';

interface ITransakDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransakDialog: React.FC<ITransakDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div
          className={classNames(
            'custom-dialog tw-font-body',
            styles.dialogContainer,
          )}
        >
          <div className={styles.container}>
            <div className={styles.close} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className={styles.innerContainer}>
              <TransakScreen />
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
};
