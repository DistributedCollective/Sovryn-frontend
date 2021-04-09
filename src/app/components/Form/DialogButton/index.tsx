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

export function DialogButton(props: Props) {
  return (
    <div className="tw-flex tw-justify-between tw-items-center tw-space-x-8">
      <button
        className={cn('tw-btn-dialog')}
        onClick={props.onConfirm}
        {...props}
      >
        {props.confirmLabel}
      </button>
      {props.cancelLabel && props.onCancel && (
        <button
          className={cn('tw-btn-dialog tw-btn-dialog__secondary')}
          onClick={props.onCancel}
          type="button"
        >
          {props.cancelLabel}
        </button>
      )}
    </div>
  );
}

DialogButton.defaultProps = {
  type: 'button',
};
