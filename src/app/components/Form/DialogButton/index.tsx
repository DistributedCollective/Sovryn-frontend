import React from 'react';
import cn from 'classnames';

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
  ...props
}: Props) {
  return (
    <div className="tw-flex tw-justify-between tw-items-center tw-space-x-3">
      <button className={cn('tw-btn-dialog')} onClick={onConfirm} {...props}>
        {confirmLabel}
      </button>
      {cancelLabel && onCancel && (
        <button
          className={cn('tw-btn-dialog tw-btn-dialog__secondary')}
          onClick={onCancel}
          type="button"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
}

DialogButton.defaultProps = {
  type: 'button',
};
