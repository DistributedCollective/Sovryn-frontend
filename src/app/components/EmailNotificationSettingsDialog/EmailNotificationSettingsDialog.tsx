import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Input } from 'app/components/Form/Input';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import axios from 'axios';
import { useAccount } from 'app/hooks/useAccount';
import { parseJwt, validateEmail } from 'utils/helpers';
import { walletService } from '@sovryn/react-wallet';
import {
  currentChainId,
  notificationServiceUrl,
  WIKI_TRADE_NOTIFICATIONS_LINK,
} from 'utils/classifiers';
import {
  EmailNotificationSettingsContextProvider,
  useEmailNotificationSettingsContext,
} from './contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from './hooks/useHandleSubscriptions';
import { ErrorBadge } from '../Form/ErrorBadge';
import {
  defaultSubscriptionsArray,
  NotificationUser,
} from './EmailNotificationSettingsDialog.types';
import { Subscriptions } from './components/Subscriptions';
import classNames from 'classnames';
import { ErrorMessage } from './components/ErrorMessage';

const userEndpoint = `${notificationServiceUrl[currentChainId]}user/`;

interface IEmailNotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailNotificationSettingsDialogComponent: React.FC<IEmailNotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null,
  );
  const [
    notificationUser,
    setNotificationUser,
  ] = useState<NotificationUser | null>(null);
  const [notificationWallet, setNotificationWallet] = useState<string | null>(
    null,
  );
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [areChangesSaved, setAreChangesSaved] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const {
    subscriptions,
    haveSubscriptionsBeenUpdated,
  } = useEmailNotificationSettingsContext();

  const {
    resetSubscriptions,
    parseSubscriptionsResponse,
  } = useHandleSubscriptions();

  const isValidEmail = useMemo(() => !email || validateEmail(email), [email]);

  const isEmailInputDisabled = useMemo(
    () =>
      (!notificationToken && !isUnsubscribed) ||
      !account ||
      loading ||
      authError,
    [notificationToken, account, loading, authError, isUnsubscribed],
  );

  const hasUnconfirmedEmail = useMemo(
    () =>
      account &&
      isValidEmail &&
      !!notificationUser &&
      !!email &&
      email === notificationUser.email &&
      !notificationUser.isEmailConfirmed,
    [account, email, isValidEmail, notificationUser],
  );

  const hasUnsavedChanges = useMemo(() => {
    const { email: emailNotification, isEmailConfirmed } =
      notificationUser || {};
    return (
      isEmailConfirmed &&
      !isUnsubscribed &&
      ((isValidEmail && email !== emailNotification) ||
        (haveSubscriptionsBeenUpdated && isValidEmail))
    );
  }, [
    isValidEmail,
    haveSubscriptionsBeenUpdated,
    notificationUser,
    email,
    isUnsubscribed,
  ]);

  const areSubscriptionsDisabled = useMemo(
    () =>
      !notificationToken ||
      loading ||
      !isValidEmail ||
      email?.length === 0 ||
      isUnsubscribed ||
      !notificationUser?.isEmailConfirmed,
    [
      loading,
      notificationToken,
      isUnsubscribed,
      isValidEmail,
      email,
      notificationUser,
    ],
  );

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      isUnsubscribed ||
      authError ||
      !notificationToken ||
      !isValidEmail ||
      (!email && !notificationUser?.isEmailConfirmed) ||
      (email === notificationUser?.email && !haveSubscriptionsBeenUpdated),
    [
      email,
      isValidEmail,
      loading,
      authError,
      isUnsubscribed,
      notificationToken,
      notificationUser,
      haveSubscriptionsBeenUpdated,
    ],
  );

  const shouldFetchToken = useMemo(() => isOpen && !notificationToken, [
    isOpen,
    notificationToken,
  ]);

  const shouldFetchUser = useMemo(() => notificationToken && isOpen, [
    isOpen,
    notificationToken,
  ]);

  const wasAccountDisconnected = useMemo(
    () =>
      (notificationToken && !account) ||
      (account && notificationWallet !== account),
    [account, notificationToken, notificationWallet],
  );

  const resetNotification = useCallback(() => {
    setEmail('');
    resetSubscriptions();
    setNotificationUser(null);
    setNotificationToken(null);
    setNotificationWallet(null);
  }, [resetSubscriptions]);

  const getToken = useCallback(async () => {
    if (!account) {
      return;
    }

    const timestamp = new Date();
    const message = `Login to backend on: ${timestamp}`;

    const { data: alreadyUser } = await axios.get(
      `${userEndpoint}isUser/${account}`,
    );

    return walletService
      .signMessage(message)
      .then(signedMessage =>
        axios
          .post(`${userEndpoint}${alreadyUser ? 'auth' : 'register'}`, {
            signedMessage,
            message,
            walletAddress: account,
            ...(alreadyUser
              ? ''
              : { subscriptions: defaultSubscriptionsArray }),
          })
          .then(res => {
            if (res.data?.token) {
              setNotificationToken(res.data.token);
              setNotificationWallet(account);
              setAuthError(false);
            }
          }),
      )
      .catch(error => {
        console.error(error);
        onClose();
      });
  }, [account, onClose]);

  const handleEmailDelete = useCallback(() => {
    setIsUnsubscribed(true);
    setEmail('');
    resetSubscriptions();
    setNotificationUser(null);
  }, [resetSubscriptions]);

  const handleUserDataResponse = useCallback(
    (response: Promise<any>, isUserUpdated = false) => {
      response
        .then(({ data }) => {
          const { email, subscriptions, isEmailConfirmed } = data ?? {};
          setNotificationUser(data);
          setEmail(email ?? '');

          if (isEmailConfirmed && subscriptions?.length) {
            parseSubscriptionsResponse(subscriptions);
          }

          setAreChangesSaved(isEmailConfirmed && isUserUpdated);
        })
        .catch(error => {
          console.error(error);
          if (error?.response?.status === 401) {
            setAuthError(true);
            getToken();
          }
        })
        .finally(() => setLoading(false));
    },
    [getToken, parseSubscriptionsResponse],
  );

  const handleUserDelete = useCallback(
    (response: Promise<any>) => {
      response
        .then(() => handleEmailDelete())
        .catch(error => {
          console.error(error);
          if (error?.response?.status === 401) {
            setAuthError(true);
            getToken();
          }
        })
        .finally(() => setLoading(false));
    },
    [getToken, handleEmailDelete],
  );

  const getUser = useCallback(() => {
    if (!account || !notificationToken) {
      return;
    }

    const userId = parseJwt(notificationToken)?.sub;

    if (!userId) {
      return;
    }

    setLoading(true);

    const promise = axios.get(`${userEndpoint}${userId}`, {
      headers: {
        Authorization: 'bearer ' + notificationToken,
      },
    });

    handleUserDataResponse(promise);
  }, [handleUserDataResponse, account, notificationToken]);

  const updateUser = useCallback(() => {
    if (!account || !notificationToken) {
      return;
    }

    const userId = parseJwt(notificationToken)?.sub;
    if (!userId) {
      return;
    }

    setLoading(true);

    if (email.length === 0) {
      const promise = axios.delete(`${userEndpoint}${userId}`, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      });

      handleUserDelete(promise);
    } else {
      const promise = axios.put(
        `${userEndpoint}${account}`,
        {
          walletAddress: account,
          email: email || undefined,
          subscriptions: subscriptions,
        },
        {
          headers: {
            Authorization: 'bearer ' + notificationToken,
          },
        },
      );

      handleUserDataResponse(promise, true);
    }
  }, [
    account,
    email,
    handleUserDataResponse,
    notificationToken,
    subscriptions,
    handleUserDelete,
  ]);

  useEffect(() => {
    if (!isValidEmail && !notificationUser) {
      setIsUnsubscribed(false);
    }
  }, [isValidEmail, notificationUser]);

  useEffect(() => {
    if (
      wasAccountDisconnected ||
      shouldFetchToken ||
      shouldFetchUser ||
      hasUnsavedChanges ||
      !isValidEmail
    ) {
      setAreChangesSaved(false);
      setAuthError(false);
    }
  }, [
    wasAccountDisconnected,
    shouldFetchToken,
    shouldFetchUser,
    hasUnsavedChanges,
    isValidEmail,
  ]);

  useEffect(() => {
    if (wasAccountDisconnected) {
      resetNotification();
    }
  }, [resetNotification, wasAccountDisconnected]);

  useEffect(() => {
    if (shouldFetchToken) {
      getToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchToken]);

  useEffect(() => {
    if (shouldFetchUser) {
      getUser();
      setIsUnsubscribed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetchUser]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mx-auto tw-w-full tw-mw-340">
        <div className="tw-mb-6 tw-text-center tw-font-semibold tw-text-lg">
          {t(translations.emailNotificationsDialog.dialogTitle)}
        </div>

        <div className="tw-mb-6 tw-text-xs">
          <Trans
            i18nKey={translations.emailNotificationsDialog.title}
            components={[
              <a
                href={WIKI_TRADE_NOTIFICATIONS_LINK}
                target="_blank"
                rel="noreferrer noopener"
              >
                x
              </a>,
            ]}
          />
        </div>

        <div className="tw-mb-8">
          <FormGroup
            label={`${t(
              translations.emailNotificationsDialog.emailInputLabel,
            )}:`}
            labelClassName="tw-text-sm tw-font-normal tw-mb-2"
          >
            <Input
              value={email}
              onChange={setEmail}
              placeholder={t(
                translations.emailNotificationsDialog.emailInputPlaceholder,
              )}
              inputClassName="tw-font-medium"
              disabled={isEmailInputDisabled}
              className={classNames('tw-rounded-lg tw-h-8', {
                'tw-pointer-events-none tw-opacity-50 tw-cursor-not-allowed': isEmailInputDisabled,
              })}
            />

            {isUnsubscribed && (
              <p className="tw-mt-0 tw-mb-3 tw-py-4 tw-text-xs tw-text-primary-75">
                {t(translations.emailNotificationsDialog.unsubscribed)}
              </p>
            )}

            <ErrorMessage
              authError={authError}
              emailIsValid={isValidEmail}
              hasUnconfirmedEmail={hasUnconfirmedEmail}
            />
          </FormGroup>

          <Subscriptions isDisabled={areSubscriptionsDisabled} />
        </div>

        {hasUnsavedChanges && (
          <ErrorBadge
            className="tw-mt-0 tw-text-center"
            content={t(
              translations.emailNotificationsDialog.unsavedChangesMessage,
            )}
          />
        )}

        {areChangesSaved && !hasUnconfirmedEmail && (
          <p className="tw-py-4 tw-mb-3 tw-text-center tw-text-xs tw-text-primary-75">
            {t(translations.emailNotificationsDialog.savedChangesMessage)}
          </p>
        )}

        <DialogButton
          confirmLabel={t(translations.common.save)}
          onConfirm={updateUser}
          disabled={isSubmitDisabled}
          className="tw-rounded-lg"
        />
      </div>
    </Dialog>
  );
};

export const EmailNotificationSettingsDialog: React.FC<IEmailNotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => (
  <EmailNotificationSettingsContextProvider>
    <EmailNotificationSettingsDialogComponent
      isOpen={isOpen}
      onClose={onClose}
    />
  </EmailNotificationSettingsContextProvider>
);
