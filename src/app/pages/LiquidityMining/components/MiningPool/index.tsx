import React, { useState } from 'react';
import { PoolDetails } from '../../types/pool-details';
import { Dialog } from '../../../../containers/Dialog';

interface Props {
  pool: PoolDetails;
}

type DialogType = 'none' | 'add' | 'remove';

export function MiningPool({ pool }: Props) {
  const [dialog, setDialog] = useState<DialogType>('none');

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mb-3 bg-secondaryBackground rounded-lg p-3">
        <div>
          <div>{pool.pool}</div>
          <div>{pool.token}</div>
        </div>
        <div>
          <button onClick={() => setDialog('add')}>Add</button>
          <button onClick={() => setDialog('remove')}>Withdraw</button>
        </div>
      </div>
      <Dialog isOpen={dialog === 'add'}>add</Dialog>
      <Dialog isOpen={dialog === 'remove'}>remove</Dialog>
    </>
  );
}
