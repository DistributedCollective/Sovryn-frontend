import React from 'react';
import { TitleWrapper } from './styled';
import { TxStatus } from 'store/global/transactions-store/types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

const getTitle = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED)
    return (
      <Trans
        i18nKey={translations.userAssets.convertDialog.txDialog.titleFailed}
      />
    );
  if (tx === TxStatus.CONFIRMED)
    return (
      <Trans
        i18nKey={translations.userAssets.convertDialog.txDialog.titleCompleted}
      />
    );
  return (
    <Trans
      i18nKey={translations.userAssets.convertDialog.txDialog.titleInProgress}
    />
  );
};

interface ITitleProps {
  txStatus: TxStatus;
}

export const Title: React.FC<ITitleProps> = ({ txStatus }) => (
  <TitleWrapper>{getTitle(txStatus)}</TitleWrapper>
);
