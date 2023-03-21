import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { discordInvite } from 'utils/classifiers';
import { translations } from 'locales/i18n';

interface ErrorMessageProps {
  emailIsValid?: boolean;
  hasUnconfirmedEmail?: boolean;
  authError?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  emailIsValid,
  hasUnconfirmedEmail,
  authError,
}) => {
  const renderMessage = useMemo(
    () =>
      authError
        ? translations.emailNotificationsDialog.authErrorMessage
        : !emailIsValid
        ? translations.emailNotificationsDialog.invalidEmailWarning
        : hasUnconfirmedEmail
        ? translations.emailNotificationsDialog.unconfirmedEmailWarning
        : '',
    [authError, emailIsValid, hasUnconfirmedEmail],
  );

  return (
    <ErrorBadge
      className="tw-mt-0"
      content={
        <Trans
          i18nKey={renderMessage}
          components={[
            <a
              href={discordInvite}
              target="_blank"
              rel="noreferrer noopener"
              className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
            >
              x
            </a>,
          ]}
        />
      }
    />
  );
};
