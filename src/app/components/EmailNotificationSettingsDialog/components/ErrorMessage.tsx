import React, { useMemo } from 'react';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const renderMessage = useMemo(() => {
    if (authError) {
      return t(translations.emailNotificationsDialog.authErrorMessage);
    }
    if (!emailIsValid) {
      return t(translations.emailNotificationsDialog.invalidEmailWarning);
    }
    if (hasUnconfirmedEmail) {
      return t(translations.emailNotificationsDialog.unconfirmedEmailWarning);
    }
    return '';
  }, [t, authError, emailIsValid, hasUnconfirmedEmail]);

  return !emailIsValid || hasUnconfirmedEmail || authError ? (
    <ErrorBadge className="tw-mt-0" content={renderMessage} />
  ) : null;
};
