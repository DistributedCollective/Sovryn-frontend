import React from 'react';
import clsx from 'clsx';

import '../../assets/index.scss';
import { AssetWalletBalance } from '../../../../components/AssetWalletBalance';
import { Asset } from '../../../../../types/asset';

type Props = {
  currency: string;
  title?: string;
  isConnected: boolean;
  valid: boolean;
  txState: any;
  handleSubmit: (e: any) => void;
  handleSubmitWithdraw?: (e: any) => void;
};

const AccountBalance: React.FC<Props> = ({
  currency,
  handleSubmit,
  handleSubmitWithdraw,
  isConnected,
  valid,
  txState,
  title,
}) => {
  let asset = currency === 'BTC' ? Asset.BTC : Asset.DOC;

  return (
    <div
      className={clsx(
        'account-balance-container',
        currency === 'DOC' && 'account-balance-container__green',
      )}
    >
      <AssetWalletBalance asset={asset} />
      <button
        onClick={title === 'Withdraw' ? handleSubmitWithdraw : handleSubmit}
        disabled={txState.loading || !isConnected || !valid}
      >
        {title} {currency}
      </button>
    </div>
  );
};

export default AccountBalance;
