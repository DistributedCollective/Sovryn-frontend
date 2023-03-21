import {
  Notification,
  AlertGroup,
  AlertGroupToNotificationsMapping,
} from './EmailNotificationSettingsDialog.types';

export const isSubscribedToGroup = (
  group: AlertGroup,
  subscriptions: Notification[],
) => {
  const groupNotifications = subscriptions
    .map(item =>
      AlertGroupToNotificationsMapping[group].includes(item.notification)
        ? item
        : null,
    )
    .filter(item => item !== null);

  return groupNotifications.every(item => item?.isSubscribed);
};
