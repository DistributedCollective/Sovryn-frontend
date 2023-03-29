import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Notification } from '../EmailNotificationSettingsDialog.types';
import { noop } from 'app/constants';

interface IEmailNotificationSettingsContextProviderProps {
  children: ReactNode;
}

type EmailNotificationSettingsContextValue = {
  setServerSubscriptionsState: Dispatch<SetStateAction<Notification[]>>;
  subscriptions: Notification[];
  setSubscriptions: Dispatch<SetStateAction<Notification[]>>;
  resetSubscriptions: () => void;
  marginCallsToggle: boolean;
  setMarginCallsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  spotCallsToggle: boolean;
  setSpotCallsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  haveSubscriptionsBeenUpdated: boolean;
};

const defaultContextValue: EmailNotificationSettingsContextValue = {
  setServerSubscriptionsState: noop,
  subscriptions: [],
  setSubscriptions: noop,
  resetSubscriptions: noop,
  marginCallsToggle: false,
  setMarginCallsToggle: noop,
  spotCallsToggle: false,
  setSpotCallsToggle: noop,
  haveSubscriptionsBeenUpdated: false,
};

const EmailNotificationSettingsContext = createContext<
  EmailNotificationSettingsContextValue
>(defaultContextValue);

export const useEmailNotificationSettingsContext = () =>
  useContext(EmailNotificationSettingsContext);

export const EmailNotificationSettingsContextProvider: React.FC<IEmailNotificationSettingsContextProviderProps> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] = useState(
    defaultContextValue.subscriptions,
  );

  const [serverSubscriptionsState, setServerSubscriptionsState] = useState(
    defaultContextValue.subscriptions,
  );

  const [
    haveSubscriptionsBeenUpdated,
    setHaveSubscriptionsBeenUpdated,
  ] = useState(defaultContextValue.haveSubscriptionsBeenUpdated);

  const [marginCallsToggle, setMarginCallsToggle] = useState(false);
  const [spotCallsToggle, setSpotCallsToggle] = useState(false);

  const resetSubscriptions = useCallback(() => {
    setSubscriptions(defaultContextValue.subscriptions);
  }, []);

  useEffect(() => {
    // New users or previously registered users without any subscriptions
    if (subscriptions.length > 0 && serverSubscriptionsState.length === 0) {
      const isSubscribedToSomething = subscriptions.some(
        item => item.isSubscribed,
      );

      if (isSubscribedToSomething) {
        setHaveSubscriptionsBeenUpdated(true);
      } else if (!isSubscribedToSomething && haveSubscriptionsBeenUpdated) {
        setHaveSubscriptionsBeenUpdated(false);
      }
    }

    // Regular users with existing subscriptions
    if (subscriptions.length > 0 && serverSubscriptionsState.length > 0) {
      const haveSubscriptionsBeenUpdated = subscriptions.some(
        item =>
          item.isSubscribed !==
          serverSubscriptionsState.find(
            serverItem => serverItem.notification === item.notification,
          )!.isSubscribed,
      );

      setHaveSubscriptionsBeenUpdated(haveSubscriptionsBeenUpdated);
    }
  }, [subscriptions, serverSubscriptionsState, haveSubscriptionsBeenUpdated]);

  return (
    <EmailNotificationSettingsContext.Provider
      value={{
        setServerSubscriptionsState,
        subscriptions,
        setSubscriptions,
        resetSubscriptions,
        marginCallsToggle,
        setMarginCallsToggle,
        spotCallsToggle,
        setSpotCallsToggle,
        haveSubscriptionsBeenUpdated,
      }}
    >
      {children}
    </EmailNotificationSettingsContext.Provider>
  );
};
