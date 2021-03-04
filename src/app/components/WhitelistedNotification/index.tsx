import React from 'react';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsWhitelisted } from '../../hooks/whitelist/useIsWhitelisted';

export function WhitelistedNotification() {
  const isWhitelisted = useIsWhitelisted();
  const { t } = useTranslation();

  if (isWhitelisted) return <></>;

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6 tw-mb-4">
      <div className="bg-info sovryn-border tw-rounded-full tw-p-3 tw-flex tw-flex-row tw-justify-start tw-items-center">
        <div className="tw-ml-3 tw-mr-4">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>{t(translations.whiteListedNotification.text)}</div>
      </div>
    </div>
  );
}
