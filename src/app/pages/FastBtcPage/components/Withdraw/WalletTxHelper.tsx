import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunctionKeys, TOptions } from 'i18next';
import { translations } from 'locales/i18n';

import { SelectBox } from '../../../BridgeDepositPage/components/SelectBox';
import { noop } from '../../../../constants';
import {
  getWalletImage,
  getWalletName,
} from '../../../../components/UserAssets/TxDialog/WalletLogo';
import { detectWeb3Wallet } from '../../../../../utils/helpers';
import { SendTxResponse } from '../../../../hooks/useSendContractTx';
import { TxStatus } from '../../../../../store/global/transactions-store/types';

type WalletTxHelperProps = {
  onClick?: () => void;
  tx?: SendTxResponse;
  description?: React.ReactNode;
  descriptionI18nKey?: TFunctionKeys;
  descriptionIOptions?: TOptions;
};

export const WalletTxHelper: React.FC<WalletTxHelperProps> = ({
  onClick = noop,
  tx,
  description,
  descriptionI18nKey,
  descriptionIOptions,
}) => {
  const walletName = detectWeb3Wallet();
  const { t } = useTranslation();

  const renderDescription = useMemo(() => {
    const options = {
      wallet: walletName,
      ...descriptionIOptions,
    };

    if (description) {
      return description;
    }

    if (descriptionI18nKey) {
      return t(descriptionI18nKey, options);
    }

    if (tx) {
      switch (tx.status) {
        case TxStatus.NONE:
        case TxStatus.PENDING_FOR_USER:
          return t(
            translations.fastBtcPage.withdraw.walletTxHelper.confirm,
            options,
          );
        case TxStatus.PENDING:
          return t(
            translations.fastBtcPage.withdraw.walletTxHelper.pending,
            options,
          );
        case TxStatus.FAILED:
          return t(
            translations.fastBtcPage.withdraw.walletTxHelper[
              tx.txHash ? 'failed' : 'aborted'
            ],
            options,
          );
        case TxStatus.CONFIRMED:
          return t(
            translations.fastBtcPage.withdraw.walletTxHelper.confirmed,
            options,
          );
      }
    }

    return null;
  }, [t, walletName, description, descriptionI18nKey, descriptionIOptions, tx]);

  return (
    <>
      <SelectBox onClick={onClick}>
        <img
          className="tw-h-20 tw-mb-5 tw-mt-2"
          src={getWalletImage(walletName)}
          alt={walletName}
        />
        <div>{getWalletName(walletName)}</div>
      </SelectBox>
      {renderDescription && (
        <p className="tw-w-80 tw-mt-12 tw-text-center">{renderDescription}</p>
      )}
    </>
  );
};
