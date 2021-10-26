import { Classes, Overlay } from '@blueprintjs/core';
import React from 'react';
import { FullVesting } from './types';
import { VestingWithdrawForm } from './VestingWithdrawForm';
import type { Nullable } from 'types';

interface VestingWithdrawDialogProps {
  vesting: Nullable<FullVesting>;
  isOpen: boolean;
  onClose: () => void;
}

export const VestingWithdrawDialog: React.FC<VestingWithdrawDialogProps> = ({
  vesting,
  isOpen,
  onClose,
}) => {
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onClose={onClose}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        hasBackdrop
        canOutsideClickClose
        canEscapeKeyClose
      >
        <div className="custom-dialog-container">
          <div className="custom-dialog tw-font-body">
            {vesting && (
              <VestingWithdrawForm vesting={vesting} onClose={onClose} />
            )}
          </div>
        </div>
      </Overlay>
    </>
  );
};
