/**
 *
 * LimitsNotification
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { translations } from '../../../locales/i18n';
import { currentNetwork } from '../../../utils/classifiers';

interface Props {}

export function LimitsNotification(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  if (currentNetwork !== 'mainnet') return <></>;

  return (
    <div className="container mt-6 mb-4">
      <div className="bg-info sovryn-border rounded p-3 d-flex flex-row justify-content-start align-items-center">
        <div className="ml-3 mr-4">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>{t(translations.limitsNotification.text)}</div>
      </div>
    </div>
  );
}
