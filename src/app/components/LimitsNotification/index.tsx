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
    <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6 tw-mb-6">
      <div className="bg-info sovryn-border tw-rounded-full tw-p-4 tw-flex tw-flex-row tw-justify-start tw-items-center">
        <div className="tw-ml-4 tw-mr-6">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>{t(translations.limitsNotification.text)}</div>
      </div>
    </div>
  );
}
