import React from 'react';

import { Asset } from 'types/asset';
import { AssetWalletBalance } from 'app/components/AssetWalletBalance';
import { SendTxProgress } from 'app/components/SendTxProgress';
import { TradeButton } from 'app/components/TradeButton';

import '../../assets/index.scss';
import { ButtonType } from '../../types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

type Props = {
  currency: Asset;
  title: ButtonType;
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
  const { t } = useTranslation();
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
          text={t(translations.lendingPage.tradeButtons[title], {
            asset: currency,
          })}
          onClick={
            title === ButtonType.REDEEM
              ? handleSubmitWithdraw
              : title === ButtonType.REPAY
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
