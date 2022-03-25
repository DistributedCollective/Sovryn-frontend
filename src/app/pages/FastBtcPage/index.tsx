import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { useAccount } from '../../hooks/useAccount';
import { WithdrawContainer } from './containers/WithdrawContainer';
import { DepositContainer } from './containers/DepositContainer';
import classNames from 'classnames';
import styles from './fast-btc-page.module.css';
import { FastBtcDirectionType } from './types';
import { Chain } from 'types';
import { usePageActions } from 'app/containers/PageContainer';

export const FastBtcPage: React.FC = () => {
  const account = useAccount();
  const page = usePageActions();

  useLayoutEffect(() => {
    page.updateOptions({
      headerProps: { address: account },
    });
  }, [account, page]);

  const { t } = useTranslation();

  const { type, network = Chain.RSK } = useParams<{
    type: FastBtcDirectionType;
    network: Chain;
  }>();
  const history = useHistory();

  useEffect(() => {
    if (
      ![FastBtcDirectionType.DEPOSIT, FastBtcDirectionType.WITHDRAW].includes(
        type,
      )
    ) {
      history.push('/wallet');
    }
  }, [type, history]);

  const renderTitle = useMemo(() => {
    switch (type) {
      case FastBtcDirectionType.DEPOSIT:
        return t(translations.fastBtcPage.meta.titleDeposit);
      case FastBtcDirectionType.WITHDRAW:
        return t(translations.fastBtcPage.meta.titleWithdraw);
      default:
        return t(translations.fastBtcPage.meta.title);
    }
  }, [type, t]);

  return (
    <>
      <Helmet>
        <title>{renderTitle}</title>
        <meta
          name="description"
          content={t(translations.fastBtcPage.meta.description)}
        />
      </Helmet>
      <div
        className={classNames(
          'tw-flex tw-flex-row tw-justify-between tw-items-center md:tw-items-start tw-w-full tw-p-5 tw-bg-gray-4 tw-relative tw-text-sm',
          styles.page,
        )}
      >
        {type === FastBtcDirectionType.DEPOSIT && (
          <DepositContainer network={network} />
        )}
        {type === FastBtcDirectionType.WITHDRAW && network === Chain.RSK && (
          <WithdrawContainer />
        )}
      </div>
    </>
  );
};
