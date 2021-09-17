import React from 'react';
import { Dialog } from 'app/containers/Dialog';
import { Asset } from 'types';
import { TxDialog } from './TxDialog';
import styles from 'app/components/Dialogs/dialog.module.scss';
import { useConvertToXUSD } from 'app/hooks/portfolio/useConvertToXUSD';
import { ConversionDialogContent } from './ConversionDialogContent';

interface IConversionDialogProps {
  isOpen: boolean;
  asset: Asset;
  onClose: () => void;
}

export const ConversionDialog: React.FC<IConversionDialogProps> = ({
  isOpen,
  asset,
  onClose,
}) => {
  const { convert, ...convertTx } = useConvertToXUSD(asset);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        isCloseButtonShown={true}
        onClose={onClose}
        className={styles.dialog}
      >
        {asset && (
          <ConversionDialogContent
            asset={asset}
            onClose={onClose}
            convertTx={convertTx}
            onConversionSubmit={convert}
          />
        )}
      </Dialog>
      <TxDialog tx={convertTx} />
    </>
  );
};
