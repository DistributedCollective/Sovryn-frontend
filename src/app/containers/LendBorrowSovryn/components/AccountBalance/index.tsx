import React from 'react';

import { Asset } from 'types/asset';
import { AssetWalletBalance } from 'app/components/AssetWalletBalance';
import { SendTxProgress } from 'app/components/SendTxProgress';
import { TradeButton } from 'app/components/TradeButton';

import '../../assets/index.scss';

type Props = {
  currency: Asset;
  title?: string;
  isConnected: boolean;
  valid: boolean;
  txState: any;
  handleSubmit: () => void;
  handleSubmitWithdraw?: () => void;
  handleSubmitRepay?: () => void;
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
    <>
      <SendTxProgress
        {...txState}
        type={txState.type}
        displayAbsolute={false}
      />
      <div className="account-balance-container position-relative">
        <AssetWalletBalance asset={currency} />
        <TradeButton
          text={`${title} ${currency}`}
          onClick={
            title === 'Redeem'
              ? handleSubmitWithdraw
              : title === 'Repay'
              ? handleSubmitRepay
              : handleSubmit
          }
          disabled={txState.loading || !isConnected || !valid}
          loading={txState.loading}
        />
      </div>
    </>
  );
};

export default AccountBalance;
