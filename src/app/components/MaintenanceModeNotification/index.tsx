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
    <div className="container mt-6 mb-4">
      <div className="bg-danger sovryn-border rounded p-3 d-flex flex-row justify-content-start align-items-center">
        <div className="ml-3 mr-4">
          <Icon icon="warning-sign" iconSize={26} />
        </div>
        <div>
          New trades and top ups are disabled to allow time for the display
          warnings and prevention systems to be improved.
        </div>
      </div>
    </div>
  );
}
