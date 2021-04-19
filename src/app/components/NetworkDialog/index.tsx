import * as Classes from '@blueprintjs/core/lib/esm/common/classes';
import { Overlay } from '@blueprintjs/core/lib/esm/components/overlay/overlay';
import classNames from 'classnames';
import * as React from 'react';

import styles from './index.module.css';

type DialogSize = 'normal' | 'large' | 'small';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClosed?: () => void;
  onClosing?: () => void;
  className?: string;
  children?: React.ReactNode;
  size?: DialogSize;
}

export function NetworkDialog(props: Props) {
  return (
    <Overlay
      {...props}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
    >
      <div className={Classes.DIALOG_CONTAINER}>
        <article
          // eslint-disable-next-line jsx-a11y/aria-role
          role="modal"
          className={classNames(
            Classes.DIALOG,
            styles.dialog,
            props.size === 'normal' && styles.dialog_normal,
            props.size === 'large' && styles.dialog_large,
            props.size === 'small' && styles.dialog_small,
            props.className,
          )}
        >
          <button
            className={styles.close}
            onClick={props.onClose}
            type="button"
            title="Close"
          >
            <span className={styles.sr_only}>Close</span>
          </button>
          <div className={styles.content}>{props.children}</div>
        </article>
      </div>
    </Overlay>
  );
}

NetworkDialog.defaultProps = {
  size: 'normal',
};
