import React, { useCallback, useState } from 'react';
import { TxStatus } from '../../../../../store/global/transactions-store/types';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { Dialog } from '../../../../containers/Dialog/Loadable';

import { ActiveLoan } from 'types/active-loan';
import { DialogContent } from './DialogContent';
import { ResetTxResponseInterface } from '../../../../hooks/useSendContractTx';

interface IClosePositionDialog {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

export function ClosePositionDialog(props: IClosePositionDialog) {
  const [tx, setTx] = useState<ResetTxResponseInterface>(({
    status: TxStatus.NONE,
  } as unknown) as ResetTxResponseInterface);
  const handleTxChange = useCallback(data => setTx(data), []);
  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        {props.showModal && props.item && (
          <DialogContent
            item={props.item}
            onCloseModal={props.onCloseModal}
            onTx={handleTxChange}
          />
        )}
      </Dialog>
      <TxDialog tx={tx} onUserConfirmed={props.onCloseModal} />
    </>
  );
}
