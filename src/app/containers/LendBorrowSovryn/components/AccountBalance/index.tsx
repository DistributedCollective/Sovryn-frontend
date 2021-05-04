import React from 'react';

import { Asset } from 'types/asset';
import { AssetWalletBalance } from 'app/components/AssetWalletBalance';
import { SendTxProgress } from 'app/components/SendTxProgress';
import { TradeButton } from 'app/components/TradeButton';

import '../../assets/index.scss';
import { ButtonType } from '../../types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { weiTo4 } from '../../../../../utils/blockchain/math-helpers';

type Props = {
  currency: Asset;
  title: ButtonType;
  isConnected: boolean;
  valid: boolean;
  validRedeem: boolean;
  txState: any;
  handleSubmit: () => void;
  handleSubmitWithdraw?: () => void;
  handleSubmitRepay?: () => void;
  canRedeem?: boolean;
  maxRedeem?: string;
  disabled?: boolean;
  disabledMsg?: string;
};

const AccountBalance: React.FC<Props> = ({
  currency,
  handleSubmit,
  handleSubmitWithdraw,
  handleSubmitRepay,
  isConnected,
  valid,
  validRedeem,
  txState,
  title,
  canRedeem,
  maxRedeem,
  disabled,
  disabledMsg,
}) => {
  const { t } = useTranslation();
  const noRedeem = title === ButtonType.REDEEM && !canRedeem;
  const isValid = title === ButtonType.REDEEM ? validRedeem : valid;
  return (
    <>
      <SendTxProgress
        {...txState}
        type={txState.type}
        displayAbsolute={false}
      />
      <div className="account-balance-container position-relative d-flex flex-column flex-md-row justify-content-md-between">
        <div className="mb-4 mb-md-0">
          <AssetWalletBalance asset={currency} />
        </div>
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
          disabled={
            txState.loading || !isConnected || !isValid || noRedeem || disabled
          }
          loading={txState.loading}
          tooltip={
            noRedeem ? (
              <>
                <p className="mb-1">
                  {t(translations.lendingPage.liquidity.redeem.line_1, {
                    currency,
                  })}
                </p>
                <p>
                  {t(translations.lendingPage.liquidity.redeem.line_2, {
                    currency,
                    amount: weiTo4(maxRedeem),
                  })}
                </p>
                <p className="mb-0">
                  {t(translations.lendingPage.liquidity.redeem.line_3)}
                </p>
              </>
            ) : disabledMsg ? (
              disabledMsg
            ) : undefined
          }
        />
      </div>
    </>
  );
};

export default AccountBalance;
