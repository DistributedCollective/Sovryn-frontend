import React from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { TransakScreen } from './TransakScreen';
import styles from './index.module.scss';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TransackDialog: React.FC<Props> = (props: Props) => {
  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
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
            <div className={styles.close} onClick={() => props.onClose()}>
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
