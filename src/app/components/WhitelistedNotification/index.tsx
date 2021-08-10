import React from 'react';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsWhitelisted } from '../../hooks/whitelist/useIsWhitelisted';

export function WhitelistedNotification() {
  const isWhitelisted = useIsWhitelisted();

  if (isWhitelisted) return <></>;

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6 tw-mb-6">
      <div className="tw-bg-info sovryn-border tw-rounded tw-p-4 tw-flex tw-flex-row tw-justify-start tw-items-center">
        <div className="tw-ml-4 tw-mr-6">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>
          <Trans
            i18nKey={translations.whiteListedNotification.text}
            components={[
              <a
                href="https://wiki.sovryn.app/"
                className="tw-font-light tw-text-gold"
                target="_blank"
                rel="noreferrer noopener"
              >
                x
              </a>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
