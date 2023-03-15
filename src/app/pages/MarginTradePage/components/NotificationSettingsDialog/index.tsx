import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Switch } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { Input } from 'app/components/Form/Input';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import imgEmail from 'assets/images/marginTrade/email.png';
import axios from 'axios';
import { useAccount } from 'app/hooks/useAccount';
import { useDispatch, useSelector } from 'react-redux';
import { parseJwt, validateEmail } from 'utils/helpers';
import { walletService } from '@sovryn/react-wallet';
import { Toast } from 'app/components/Toast';
import { currentChainId, notificationServiceUrl } from 'utils/classifiers';
import {
  Subscription,
  Notification,
} from 'app/containers/WalletProvider/types';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { actions } from 'app/containers/WalletProvider/slice';

interface INotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const isSubscribedToD1Notifications = (
  subscriptions: Subscription[] | undefined,
) => {
  if (subscriptions === undefined) {
    return false;
  } else {
    const subscribed = subscriptions
      .filter(item => item.isSubscribed === true)
      .map(item => item.notification);
    const d1Notifications = Object.values(Notification);
    const output = d1Notifications.every(item => subscribed.includes(item));

    return output;
  }
};

export const NotificationSettingsDialog: React.FC<INotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const url = notificationServiceUrl[currentChainId];
  const { t } = useTranslation();
  const account = useAccount();
  const dispatch = useDispatch();
  const {
    notificationToken,
    notificationUser,
    notificationWallet,
  } = useSelector(selectWalletProvider);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [isEmailActive, setIsEmailActive] = useState(false);

  const emailIsValid = useMemo(() => !email || validateEmail(email), [email]);
  const onChangeEmailSwitch = useCallback(
    () => setIsEmailActive(prevValue => !prevValue),
    [],
  );

  useEffect(() => {
    if (account && notificationWallet !== account) {
      dispatch(actions.resetNotification());
    }
  }, [account, dispatch, notificationWallet]);

  useEffect(() => {
    if (isOpen && !notificationToken) {
      getToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (notificationToken && isOpen && !notificationUser) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationToken, isOpen, notificationUser]);

  useEffect(() => {
    resetForm(notificationUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationUser]);

  const updateSubscriptions = useCallback(() => {
    if (notificationUser) {
      const subscriptions: Subscription[] = JSON.parse(
        JSON.stringify(notificationUser?.subscriptions),
      );

      const d1Notifications = Object.values(Notification);

      d1Notifications.forEach(item => {
        const foundSubscription = subscriptions.findIndex(
          sub => sub.notification === item,
        );
        if (foundSubscription >= 0) {
          subscriptions[foundSubscription].isSubscribed = isEmailActive;
        } else {
          const newSubscription: Subscription = {
            notification: item,
            userId: notificationUser.id,
            isSubscribed: isEmailActive,
          };
          subscriptions.push(newSubscription);
        }
      });

      return subscriptions;
    } else {
      return [];
    }
  }, [notificationUser, isEmailActive]);

  const getToken = async () => {
    if (!account) return;
    const timestamp = new Date();
    const message = `Login to backend on: ${timestamp}`;
    const { data: alreadyUser } = await axios.get(
      url + 'user/isUser/' + account,
    );
    walletService
      .signMessage(message)
      .then(signedMessage => {
        axios
          .post(url + 'user/' + (alreadyUser ? 'auth' : 'register'), {
            signedMessage,
            message,
            walletAddress: account,
          })
          .then(res => {
            if (res.data && res.data.token) {
              dispatch(
                actions.setNotificationToken({
                  token: res.data.token,
                  wallet: account,
                }),
              );
            }
          })
          .catch(error => {
            console.error(error);
            onClose();
          });
      })
      .catch(error => {
        console.error(error);
        onClose();
      });
  };

  const getUser = () => {
    if (!account || !notificationToken) return;
    const userId = parseJwt(notificationToken)?.sub;
    if (!userId) return;
    setLoading(true);
    axios
      .get(url + 'user/' + userId, {
        headers: {
          Authorization: 'bearer ' + notificationToken,
        },
      })
      .then(res => {
        if (res.data) {
          dispatch(actions.setNotificationUser(res.data));
          resetForm(res.data);
        }
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          getToken();
        }
      })
      .finally(() => setLoading(false));
  };

  const updateUser = () => {
    if (!account || !notificationToken) return;
    const userId = parseJwt(notificationToken)?.sub;
    if (!userId) return;
    setLoading(true);

    axios
      .put(
        url + 'user/' + account,
        {
          walletAddress: account,
          email: email || undefined,
          subscriptions: updateSubscriptions(),
        },
        {
          headers: {
            Authorization: 'bearer ' + notificationToken,
          },
        },
      )
      .then(res => {
        if (res.data) {
          dispatch(actions.setNotificationUser(res.data));
          resetForm(res.data);
        }
        Toast(
          'success',
          <div className="tw-flex">
            <Trans
              i18nKey={
                translations.marginTradePage.notificationSettingsDialog
                  .updateSuccess
              }
            />
          </div>,
        );
        onClose();
      })
      .catch(error => {
        console.log(error);
        if (error?.response?.status === 401) {
          getToken();
        }
      })
      .finally(() => setLoading(false));
  };

  const resetForm = user => {
    setEmail(user?.email || '');
    setIsEmailActive(
      isSubscribedToD1Notifications(user?.subscriptions) === true,
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mx-auto tw-w-full tw-mw-340">
        <div className="tw-mb-6 tw-text-center tw-font-semibold tw-text-lg">
          {t(translations.marginTradePage.notificationSettingsDialog.title)}
        </div>

        <div className="tw-mb-6 tw-text-xs">
          <Trans
            i18nKey={
              translations.marginTradePage.notificationSettingsDialog.notifyVia
            }
            components={[
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href="https://wiki.sovryn.app/en/sovryn-dapp/trade-notifications"
                target="_blank"
                rel="noreferrer noopener"
              />,
            ]}
          />
        </div>

        <div className="tw-mb-8">
          <div className="tw-flex tw-justify-between tw-mb-2">
            <div className="tw-flex tw-items-center">
              <img
                src={imgEmail}
                className="tw-mr-1.5 tw-w-5"
                alt={t(
                  translations.marginTradePage.notificationSettingsDialog.email,
                )}
              />
              {t(translations.marginTradePage.notificationSettingsDialog.email)}
            </div>
            <Switch
              checked={isEmailActive}
              onChange={onChangeEmailSwitch}
              large
              className="tw-mb-0"
              disabled={loading || !notificationToken}
            />
          </div>

          <FormGroup
            label={`${t(
              translations.marginTradePage.notificationSettingsDialog
                .emailHandle,
            )}:`}
            className={
              !isEmailActive
                ? 'tw-pointer-events-none tw-opacity-30 tw-cursor-not-allowed'
                : ''
            }
            labelClassName="tw-text-sm tw-font-normal tw-mb-2"
          >
            <Input
              value={email}
              onChange={setEmail}
              placeholder={t(
                translations.marginTradePage.notificationSettingsDialog
                  .emailPlaceholder,
              )}
              className="tw-rounded-lg tw-h-8"
              inputClassName="tw-font-medium"
              disabled={loading || !notificationToken}
            />
          </FormGroup>
        </div>

        <DialogButton
          confirmLabel={t(
            translations.marginTradePage.notificationSettingsDialog.submit,
          )}
          onConfirm={updateUser}
          disabled={loading || !notificationToken || !emailIsValid}
          className="tw-rounded-lg"
        />
      </div>
    </Dialog>
  );
};
