import React from 'react';
import clsx from 'clsx';

import '../../assets/index.scss';
import { AssetWalletBalance } from '../../../../components/AssetWalletBalance';
import { Asset } from '../../../../../types/asset';
import { SendTxProgress } from '../../../../components/SendTxProgress';
import { TxType } from '../TabContainer';

type Props = {
  currency: Asset;
  title?: string;
  isConnected: boolean;
  valid: boolean;
  txState: any;
  handleSubmit: (e: any) => void;
  handleSubmitWithdraw?: (e: any) => void;
  handleSubmitRepay?: (e: any) => void;
};

const AccountBalance: React.FC<Props> = ({
  currency,
  handleSubmit,
  handleSubmitWithdraw,
  handleSubmitRepay,
  isConnected,
  valid,
  txState,
  title,
}) => {
  return (
    <div
      className={clsx(
        'account-balance-container',
        currency === 'DOC' && 'account-balance-container__green',
      )}
    >
      <AssetWalletBalance asset={currency} />
      <button
        onClick={
          title === 'Withdraw'
            ? handleSubmitWithdraw
            : title === 'Repay'
            ? handleSubmitRepay
            : handleSubmit
        }
        disabled={txState.loading || !isConnected || !valid}
      >
        {title} {currency}
      </button>
      {txState.type !== TxType.NONE && (
        <SendTxProgress
          status={txState.status}
          txHash={txState.txHash}
          loading={txState.loading}
          type={txState.type}
        />
      )}
    </div>
  );
};

export default AccountBalance;
