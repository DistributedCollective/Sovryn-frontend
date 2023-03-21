import {
  Notification,
  AlertGroup,
  AlertGroupToNotificationsMapping,
} from './EmailNotificationSettingsDialog.types';

export const isSubscribedToGroup = (
  group: AlertGroup,
  subscriptions: Notification[],
) => {
  if (subscriptions.length === 0) {
    // default value for notification settings - see SOV-1762 for more details
    return true;
  }

  const groupNotifications = subscriptions
    .map(item =>
      AlertGroupToNotificationsMapping[group].includes(item.notification)
        ? item
        : null,
    )
    .filter(item => item !== null);

  return groupNotifications.every(item => item?.isSubscribed);
};
