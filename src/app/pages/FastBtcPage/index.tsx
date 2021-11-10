import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import UserWallet from '../BridgeDepositPage/components/UserWallet';
import cn from 'classnames';
import { useAccount } from '../../hooks/useAccount';
import { WithdrawContainer } from './containers/WithdrawContainer';

export function FastBtcPage() {
  const { t } = useTranslation();
  const account = useAccount();

  return (
    <>
      <Helmet>
        <title>{t(translations.fastBtcPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.fastBtcPage.meta.description)}
        />
      </Helmet>
      <div
        className="tw-flex tw-flex-row tw-justify-between tw-items-start tw-w-full tw-p-5 tw-bg-gray-4 tw-relative"
        style={{ marginTop: '-4.4rem' }}
      >
        <UserWallet address={account} />
        <div
          className={cn(
            'tw-relative tw-z-50 tw-h-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-pl-8',
            { invisible: false },
          )}
          style={{ minWidth: 200, minHeight: 'calc(100vh - 2.5rem)' }}
        >
          {/*<SidebarSteps />*/}
        </div>
        <div
          style={{
            minHeight: 'calc(100% - 2.5rem)',
            minWidth: 'calc(100% - 2.5rem)',
          }}
          className="tw-flex-1 tw-flex tw-flex-col tw-items-end md:tw-items-center tw-justify-around tw-absolute tw-pb-20"
        >
          <WithdrawContainer />
        </div>
      </div>
    </>
  );
}
