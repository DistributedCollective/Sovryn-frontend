import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsConnected } from 'app/hooks/useAccount';
import { ActiveUserBorrows } from 'app/containers/ActiveUserBorrows';
import { BorrowHistory } from 'app/containers/BorrowHistory/Loadable';
import { Tabs } from '../Tabs';

export const BorrowActivity: React.FC = () => {
  const { t } = useTranslation();
  const isConnected = useIsConnected();

  const tabs = useMemo(
    () => [
      {
        id: 'active',
        label: t(translations.borrowActivity.tabs.active),
        content: <ActiveUserBorrows />,
      },
      {
        id: 'history',
        label: t(translations.borrowActivity.tabs.history),
        content: <BorrowHistory />,
      },
    ],
    [t],
  );

  return (
    <>
      {isConnected && (
        <Tabs
          items={tabs}
          initial={tabs[0].id}
          dataActionId="borrow-activity"
        />
      )}
    </>
  );
};
