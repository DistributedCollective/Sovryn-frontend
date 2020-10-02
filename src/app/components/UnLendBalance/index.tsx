/**
 *
 * UnLendBalance
 *
 */
import React, { useState } from 'react';
import { Asset } from '../../../types/asset';
import { WithdrawLentAmount } from '../../containers/WithdrawLentAmount/Loadable';

interface Props {
  asset: Asset;
}

export function UnLendBalance(props: Props) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="mt-3 d-flex flex-row justify-content-center align-items-center text-center overflow-hidden">
      <button
        type="button"
        className="btn btn-customTeal rounded text-white"
        onClick={() => setOpen(true)}
      >
        {`Withdraw ${props.asset}`}
      </button>
      <WithdrawLentAmount
        asset={props.asset}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
