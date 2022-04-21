import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import { Overlay, OverlayProps } from '../Overlay';
import styles from './index.module.scss';

interface DialogFunctionComponent<T = {}> extends FunctionComponent<T> {
  index: number;
}

export enum DialogSize {
  xs,
  sm,
  md,
  lg,
  xl,
  xl2,
  xl3,
  full,
}

const sizeMap: Record<DialogSize, string> = {
  [DialogSize.xs]: 'tw-w-full sm:tw-max-w-xs',
  [DialogSize.sm]: 'tw-w-full sm:tw-max-w-sm',
  [DialogSize.md]: 'tw-w-full sm:tw-max-w-md',
  [DialogSize.lg]: 'tw-max-w-lg',
  [DialogSize.xl]: 'tw-max-w-xl',
  [DialogSize.xl2]: 'tw-max-w-2xl',
  [DialogSize.xl3]: 'tw-max-w-3xl',
  [DialogSize.full]: 'tw-w-full',
};

type DialogProps = {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  width?: DialogSize;
  dataActionId?: string;
  overlayProps?: Omit<Partial<OverlayProps>, 'isOpen' | 'fixed'>;
  onClose?: () => void;
};

export const Dialog: DialogFunctionComponent<DialogProps> = ({
  isOpen,
  children,
  className,
  width = DialogSize.md,
  dataActionId,
  overlayProps,
  onClose,
}) => {
  const { t } = useTranslation();
  const sizeClassNames = useMemo(() => sizeMap[width], [width]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

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
      <div className={styles.dialog_wrapper} data-action-id={dataActionId}>
        <div className={styles.dialog_container}>
          <div className={classNames(styles.dialog, sizeClassNames, className)}>
            {onClose && (
              <button
                className={styles.close_button}
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
