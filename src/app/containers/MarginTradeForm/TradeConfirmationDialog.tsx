import React from 'react';
import { Dialog } from '../Dialog';
import { TradeButton } from '../../components/TradeButton';

interface Props {
  isOpen: boolean;
  onClose: (success: boolean) => void;
}

export function TradeConfirmationDialog(props: Props) {
  return (
    <Dialog isOpen={props.isOpen} onClose={() => props.onClose(false)}>
      <TradeButton text="Place Trade" onClick={() => props.onClose(true)} />
    </Dialog>
  );
}
