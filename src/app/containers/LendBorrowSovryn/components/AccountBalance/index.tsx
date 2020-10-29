import React from 'react';
import clsx from 'clsx';

import '../../assets/index.scss';
import { AssetWalletBalance } from '../../../../components/AssetWalletBalance';
import { Asset } from '../../../../../types/asset';
import { SendTxProgress } from '../../../../components/SendTxProgress';
import { TradeButton } from '../../../../components/TradeButton';

type Props = {
  currency: string;
  title?: string;
  isConnected: boolean;
  valid: boolean;
  txState: any;
  handleSubmit: () => void;
  handleSubmitWithdraw?: () => void;
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
    <>
      <SendTxProgress
        {...txState}
        type={txState.type}
        displayAbsolute={false}
      />
      <div
        className={clsx(
          'account-balance-container position-relative',
          currency === 'DOC' && 'account-balance-container__green',
        )}
      >
        <AssetWalletBalance asset={asset} />
        <TradeButton
          text={`${title} ${currency}`}
          onClick={title === 'Withdraw' ? handleSubmitWithdraw : handleSubmit}
          disabled={txState.loading || !isConnected || !valid}
          loading={txState.loading}
        />
      </div>
    </>
  );
};

export default AccountBalance;
