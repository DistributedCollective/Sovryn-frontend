import { Classes, Overlay } from '@blueprintjs/core';
import React from 'react';
import { FullVesting } from './useListOfUserVestings';
import { VestingWithdrawForm } from './VestingWithdrawForm';

interface Props {
  vesting: FullVesting;
  isOpen: boolean;
  onClose: () => void;
}

export function VestingWithdrawDialog({ vesting, isOpen, onClose }: Props) {
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
}
