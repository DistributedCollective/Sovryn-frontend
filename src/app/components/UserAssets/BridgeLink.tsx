import React from 'react';
// import { useAccount } from 'app/hooks/useAccount';
import { currentNetwork } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
import { Asset } from 'types';

interface Props {
  asset: Asset;
}

export function BridgeLink({ asset }: Props) {
  // const receiver = useAccount();
  const { t } = useTranslation();
  return (
    <>
      <a
        className="tw-btn-action"
        href={
          currentNetwork === 'mainnet'
            ? 'https://bridge.sovryn.app'
            : 'https://bridge.test.sovryn.app'
        }
        target="_blank"
        rel="noreferrer noopener"
      >
        {t(translations.common.deposit)}
      </a>
      {/* <Link
        className="tw-btn-action"
        to={{
          pathname: '/cross-chain/deposit',
          state: { receiver, asset },
        }}
      >
        <span>{t(translations.common.deposit)}</span>
      </Link> */}
      {/* <Link
        className="tw-btn-action"
        to={{
          pathname: '/cross-chain/withdraw',
          state: { receiver, asset },
        }}
      >
        <span>{t(translations.common.withdraw)}</span>
      </Link> */}
    </>
  );
}
