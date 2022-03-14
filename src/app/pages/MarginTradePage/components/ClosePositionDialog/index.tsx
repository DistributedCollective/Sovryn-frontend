import React from 'react';
import { Dialog } from '../../../../containers/Dialog/Loadable';

import { ActiveLoan } from 'types/active-loan';
import { DialogContent } from './DialogContent';
interface IClosePositionDialog {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

export function ClosePositionDialog(props: IClosePositionDialog) {
  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        {props.showModal && props.item && (
          <DialogContent item={props.item} onCloseModal={props.onCloseModal} />
        )}
      </Dialog>
    </>
  );
}
