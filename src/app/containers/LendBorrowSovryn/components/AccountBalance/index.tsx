import React from 'react';
import clsx from 'clsx';

import '../../assets/index.scss';
import { AssetWalletBalance } from '../../../../components/AssetWalletBalance';
import { Asset } from '../../../../../types/asset';
import { SendTxProgress } from '../../../../components/SendTxProgress';
import { TradeButton } from '../../../../components/TradeButton';
import { TxType } from '../TabContainer';

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
      {txState.type !== TxType.NONE && (
        <SendTxProgress
          {...txState}
          type={txState.type}
          displayAbsolute={false}
        />
      )}
      <div
        className={clsx(
          'account-balance-container position-relative',
          currency === Asset.DOC && 'account-balance-container__green',
        )}
      >
        <AssetWalletBalance asset={currency} />
        <TradeButton
          text={`${title} ${currency}`}
          onClick={
            title === 'Withdraw'
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
