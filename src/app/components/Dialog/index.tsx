import React, { useCallback, useEffect, useMemo, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { Overlay, OverlayProps } from '../Overlay';
import styles from './index.module.scss';
import { DialogSize, dialogSizeMap, IDialogFunctionComponent } from './types';

type DialogProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  width?: DialogSize;
  dataActionId?: string;
  overlayProps?: Omit<Partial<OverlayProps>, 'isOpen' | 'fixed'>;
  onClose?: () => void;
};

export const Dialog: IDialogFunctionComponent<DialogProps> = ({
  isOpen,
  children,
  className,
  width = DialogSize.md,
  dataActionId,
  overlayProps,
  onClose,
}) => {
  const { t } = useTranslation();
  const sizeClassNames = useMemo(() => dialogSizeMap[width], [width]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleChildElementClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    // make sure that multiple dialogs opened showing up in correct order.
    Dialog.index++;
  }, []);

  return (
    <Overlay
      zIndex={100 + Dialog.index}
      isOpen={isOpen}
      fixed
      portalTarget="body"
      portalClassName="tw-relative"
      onBlur={handleClose}
      {...overlayProps}
    >
      <div className={styles.wrapper} data-action-id={dataActionId}>
        <div className={styles.container}>
          <div
            className={classNames(styles.dialog, sizeClassNames, className)}
            onClick={handleChildElementClick}
          >
            {onClose && (
              <button
                className={styles.closeButton}
                onClick={handleClose}
                data-action-id={`close-${dataActionId || 'dialog'}`}
              >
                <span className="tw-sr-only">
                  {t(translations.common.close)}
                </span>
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  );
};

Dialog.index = 0;
