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
  txState: any;
  handleSubmit: () => void;
  handleSubmitWithdraw?: () => void;
  handleSubmitRepay?: () => void;
  canRedeem?: boolean;
  maxRedeem?: string;
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
  canRedeem,
  maxRedeem,
}) => {
  const { t } = useTranslation();
  const noRedeem = title === ButtonType.REDEEM && !canRedeem;
  return (
    <>
      <SendTxProgress
        {...txState}
        type={txState.type}
        displayAbsolute={false}
      />
      <div className="account-balance-container tw-relative tw-flex tw-flex-col flex-md-row md:tw-justify-between">
        <div className="tw-mb-6 md:tw-mb-0">
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
          disabled={txState.loading || !isConnected || !valid || noRedeem}
          loading={txState.loading}
          tooltip={
            noRedeem ? (
              <>
                <p className="tw-mb-1">
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
                <p className="tw-mb-0">
                  {t(translations.lendingPage.liquidity.redeem.line_3)}
                </p>
              </>
            ) : undefined
          }
        />
      </div>
    </>
  );
};

export default AccountBalance;
