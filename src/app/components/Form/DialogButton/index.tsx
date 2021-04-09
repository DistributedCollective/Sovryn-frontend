import React from 'react';
import cn from 'classnames';
import { ButtonProps } from '../Button';

interface Props extends ButtonProps {
  confirmLabel: React.ReactNode;
  onConfirm: () => void;
  cancelLabel?: React.ReactNode;
  onCancel?: () => void;
  className?: string;
}

export function TradeButton(props: Props) {
  return (
    <div>
      <button className={cn('tw-btn-trade')} onClick={props.onConfirm}>
        {props.confirmLabel}
      </button>
      {props.cancelLabel && props.onCancel && (
        <button className={cn('tw-btn-trade')} onClick={props.onCancel}>
          {props.cancelLabel}
        </button>
      )}
    </div>
  );
}

TradeButton.defaultProps = {
  type: 'button',
};
