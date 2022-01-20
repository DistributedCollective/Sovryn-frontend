import React from 'react';
import classNames from 'classnames';

interface Props {
  confirmLabel: React.ReactNode;
  onConfirm: () => void;
  cancelLabel?: React.ReactNode;
  onCancel?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function DialogButton({
  onConfirm,
  confirmLabel,
  onCancel,
  cancelLabel,
  className,
  ...props
}: Props) {
  return (
    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-gap-3">
      <button
        className={classNames(
          'tw-btn-dialog tw-truncate tw-min-w-full',
          className,
        )}
        onClick={onConfirm}
        {...props}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

DialogButton.defaultProps = {
  type: 'button',
};
