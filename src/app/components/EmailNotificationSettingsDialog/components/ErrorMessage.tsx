import React, { useMemo } from 'react';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  isValidEmail?: boolean;
  hasUnconfirmedEmail?: boolean;
  authError?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  isValidEmail,
  hasUnconfirmedEmail,
  authError,
}) => {
  const { t } = useTranslation();
  const renderMessage = useMemo(() => {
    if (authError) {
      return t(translations.emailNotificationsDialog.authErrorMessage);
    }
    if (!isValidEmail) {
      return t(translations.emailNotificationsDialog.invalidEmailWarning);
    }
    if (hasUnconfirmedEmail) {
      return t(translations.emailNotificationsDialog.unconfirmedEmailWarning);
    }
    return '';
  }, [t, authError, isValidEmail, hasUnconfirmedEmail]);

  return !isValidEmail || hasUnconfirmedEmail || authError ? (
    <ErrorBadge className="tw-mt-0" content={renderMessage} />
  ) : null;
};
