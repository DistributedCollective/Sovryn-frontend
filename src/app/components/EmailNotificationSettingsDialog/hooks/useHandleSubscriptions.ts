import { useCallback } from 'react';

import {
  AlertGroup,
  AlertGroupToNotificationsMapping,
  defaultSubscriptionsArray,
  Notification,
  NotificationMessageType,
} from '../EmailNotificationSettingsDialog.types';
import { isSubscribedToGroup } from '../EmailNotificationSettingsDialog.utils';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';

export const useHandleSubscriptions = () => {
  const {
    subscriptions,
    setSubscriptions,
    resetSubscriptions: resetSubscriptionsState,
    setSpotCallsToggle,
    setMarginCallsToggle,
    setServerSubscriptionsState,
  } = useEmailNotificationSettingsContext();

  const resetSubscriptions = useCallback(() => {
    resetSubscriptionsState();
    setSpotCallsToggle(false);
    setMarginCallsToggle(false);
  }, [resetSubscriptionsState, setMarginCallsToggle, setSpotCallsToggle]);

  const parseSubscriptionsResponse = useCallback(
    (subscriptions: Notification[]) => {
      const parsedSubscriptions: Notification[] = subscriptions
        .filter(item =>
          Object.values(NotificationMessageType).includes(item.notification),
        )
        .map(item => ({
          notification: item.notification,
          isSubscribed: item.isSubscribed,
        }));

      setSubscriptions(parsedSubscriptions);
      setServerSubscriptionsState(parsedSubscriptions);

      setMarginCallsToggle(
        isSubscribedToGroup(AlertGroup.MarginCalls, parsedSubscriptions),
      );
      setSpotCallsToggle(
        isSubscribedToGroup(AlertGroup.SpotCalls, parsedSubscriptions),
      );
    },
    [
      setSubscriptions,
      setMarginCallsToggle,
      setSpotCallsToggle,
      setServerSubscriptionsState,
    ],
  );

  const updateSubscriptions = useCallback(
    (group: AlertGroup) => {
      const oldSubscriptionsState =
        subscriptions.length > 0 ? subscriptions : defaultSubscriptionsArray;

      const newSubscriptionsState = oldSubscriptionsState.map(item => {
        if (
          AlertGroupToNotificationsMapping[group].includes(item.notification)
        ) {
          return {
            notification: item.notification,
            isSubscribed: !item.isSubscribed,
          };
        }

        return item;
      });

      setSubscriptions(newSubscriptionsState);
    },
    [subscriptions, setSubscriptions],
  );

  const marginCallsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.MarginCalls);
    setMarginCallsToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setMarginCallsToggle]);

  const spotCallsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.SpotCalls);
    setSpotCallsToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setSpotCallsToggle]);

  return {
    resetSubscriptions,
    parseSubscriptionsResponse,
    marginCallsToggleHandler,
    spotCallsToggleHandler,
  };
};
