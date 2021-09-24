import React, { useState, useCallback } from 'react';
import { PairStats } from './PairStats';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import { pairList } from '../../types';
import { NotificationSettingsDialog } from 'app/pages/MarginTradePage/components/NotificationSettingsDialog';
import imgNotificationBell from 'assets/images/marginTrade/notifications.svg';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export const PairNavbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
      default:
        return '';
    }
  };

  const onNotificationSettingsClick = useCallback(
    () => setShowNotificationSettingsModal(true),
    [],
  );

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container">
        <PairSelect storageKey={getStorageKey()} pairList={pairList} />

        <PairStats />
        <div>
          <button
            onClick={onNotificationSettingsClick}
            className="tw-text-sm tw-text-primary tw-tracking-normal tw-flex tw-items-center"
          >
            <img
              src={imgNotificationBell}
              alt="Notification bell"
              className="tw-mr-1.5"
            />{' '}
            {t(translations.marginTradePage.notificationsButton.enable)}
          </button>
        </div>
      </div>

      <NotificationSettingsDialog
        isOpen={showNotificationSettingsModal}
        onClose={() => setShowNotificationSettingsModal(false)}
      />
    </div>
  );
};
