/**
 *
 * NotificationForm
 *
 */
import { walletService } from '@sovryn/react-wallet';
import axios from 'axios';
import classnames from 'classnames';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../../locales/i18n';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { Dialog } from '../../../containers/Dialog/Loadable';
import { useAccount } from '../../../hooks/useAccount';
import { EmailNotificationButton } from '../EmailNotificationButton';
import { NotificationFormComponent } from '../NotificationFormComponent';

interface Props {
  className?: string;
}

export function NotificationForm(props: Props) {
  const { t } = useTranslation();
  const mailSrv = backendUrl[currentChainId];

  const walletAddress = useAccount();

  const [response, setResponse] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  //Reducer for updating state on form change
  function reducer(state, { field, value }) {
    return {
      ...state,
      [field]: value,
    };
  }
  const initialState = {
    name: '',
    email: '',
    marketing: true,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, email } = state;

  //Handle form change
  const onChange = e => {
    if (e.target.type === 'checkbox') {
      dispatch({ field: e.target.name, value: !state[e.target.name] });
    } else {
      dispatch({ field: e.target.name, value: e.target.value });
    }
  };
  //UPDATE OR ADD USER
  const addUser = (e, formType) => {
    e.preventDefault();
    setResponse('pending');

    const timestamp = new Date();

    const newUser = {
      name: state.name,
      email: state.email,
      walletAddress: walletAddress,
      marketing: state.marketing,
      notifications: true,
    };

    const message = `${timestamp} \n \n Please confirm that the details associated with this account will now be: \n \n Username: ${name} \n Email: ${email}`;
    const route = formType === 'signup' ? '/addUser' : '/updateUser';

    walletService.signMessage(message).then(res =>
      axios
        .post(mailSrv + route, {
          ...newUser,
          signedMessage: res,
          message: message,
        })
        .then(res => {
          setResponse('success');
        })
        .catch(e => {
          setResponse('error');
          console.log(e);
        }),
    );
  };

  const getUser = useCallback(() => {
    setLoading(true);
    if (walletAddress) {
      axios
        .post(mailSrv + '/getUser', {
          walletAddress: walletAddress,
        })
        .then(res => {
          setUserExists(res.data.found);
          console.log('User exists: ' + userExists);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [mailSrv, walletAddress, userExists]);

  //GET USER
  useEffect(() => {
    getUser();
  }, [walletAddress, mailSrv, getUser]);

  const onClickClose = () => {
    setShowForm(false);
  };

  return (
    <>
      <div
        className={classnames(
          props.className,
          `${!loading && walletAddress && 'tw-inline'}`,
        )}
      >
        <EmailNotificationButton
          text={`${
            userExists
              ? t(
                  translations.notificationFormContainer
                    .emailSettingsBtn_update,
                )
              : t(translations.notificationFormContainer.emailSettingsBtn_get)
          }`}
          onClick={() => setShowForm(true)}
        />
      </div>
      <Dialog isOpen={showForm} onClose={onClickClose}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-tracking-normal">
            {t(translations.notificationFormContainer.dialog.title)}
          </h1>
          {loading || response === 'pending' ? (
            <div className="bp3-skeleton">&nbsp;</div>
          ) : (
            <div>
              {response !== 'success' && (
                <NotificationFormComponent
                  name={name}
                  email={email}
                  marketing={state.marketing}
                  response={response}
                  onSubmit={addUser}
                  onChange={onChange}
                  formType={userExists ? 'update' : 'signup'}
                />
              )}
              {response === 'success' && !userExists && (
                <div>
                  {t(translations.notificationFormContainer.updated_success)}
                </div>
              )}

              {response === 'success' && userExists && (
                <div>
                  {t(
                    translations.notificationFormContainer.updated_success_user,
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
