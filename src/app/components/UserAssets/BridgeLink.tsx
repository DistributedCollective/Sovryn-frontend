import React from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Asset } from 'types';

interface Props {
  asset: Asset;
}

export function BridgeLink({ asset }: Props) {
  const receiver = useAccount();
  const { t } = useTranslation();
  return (
    <>
      <Link
        to={{
          pathname: '/cross-chain/deposit',
          state: { receiver, asset },
        }}
      >
        {t(translations.common.deposit)}
      </Link>
      <Link
        to={{
          pathname: '/cross-chain/withdraw',
          state: { receiver, asset },
        }}
      >
        {t(translations.common.withdraw)}
      </Link>
    </>
  );
}
