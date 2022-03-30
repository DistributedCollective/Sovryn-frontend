import React from 'react';
import classNames from 'classnames';

type DialogButtonProps = {
  confirmLabel: React.ReactNode;
  onConfirm: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export const DialogButton: React.FC<DialogButtonProps> = ({
  onConfirm,
  confirmLabel,
  className,
  ...props
}) => (
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

DialogButton.defaultProps = {
  type: 'button',
};
