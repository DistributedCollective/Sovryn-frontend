/**
 *
 * MaintenanceModeNotification
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
// import { translations } from '../../../locales/i18n';

interface Props {}

export function MaintenanceModeNotification(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <div className="tw-container tw-mx-auto tw-px-4 tw-mt-6 tw-mb-6">
      <div className="bg-warning text-dark sovryn-border tw-rounded-full tw-p-4 tw-flex tw-flex-row tw-justify-start tw-items-center">
        <div className="tw-ml-4 tw-mr-6">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>
          We have temporarily put deposits and trading on hold. This will give
          the team time to improve warnings if liquidity is low. Thank you all
          for your feedback and helping improve the system!
        </div>
      </div>
    </div>
  );
}
