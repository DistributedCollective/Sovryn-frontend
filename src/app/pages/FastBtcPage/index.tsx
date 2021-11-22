import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { useAccount } from '../../hooks/useAccount';
import { WithdrawContainer } from './containers/WithdrawContainer';
import { DepositContainer } from './containers/DepositContainer';
import Header from './components/Header';
import classNames from 'classnames';
import styles from './fast-btc-page.module.css';

type FastBtcDirectionType = 'deposit' | 'withdraw';

export function FastBtcPage() {
  const { t } = useTranslation();
  const account = useAccount();
  const { type } = useParams<{ type: FastBtcDirectionType }>();
  const history = useHistory();

  useEffect(() => {
    if (!['deposit', 'withdraw'].includes(type)) {
      history.push('/wallet');
    }
  }, [type, history]);

  return (
    <>
      <Helmet>
        <title>{t(translations.fastBtcPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.fastBtcPage.meta.description)}
        />
      </Helmet>
      <Header address={account} />
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-justify-between tw-items-center md:tw-items-start tw-w-full tw-p-5 tw-bg-gray-4 tw-relative tw-text-sm',
          styles.page,
        )}
        style={{ marginTop: '-4.4rem' }}
      >
        {type === 'deposit' && <DepositContainer />}
        {type === 'withdraw' && <WithdrawContainer />}
      </div>
    </>
  );
}
