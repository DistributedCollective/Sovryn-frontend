/**
 *
 * Announcement
 *
 */

import React from 'react';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { InfoBox } from '../InfoBox';

export function Announcement() {
  return (
    <InfoBox
      icon="info-sign"
      content={
        <Trans
          i18nKey={translations.announcement.message}
          components={[<span className="tw-font-bold"></span>]}
        />
      }
      localStorageRef="txLimitInfo"
    />
  );
}
