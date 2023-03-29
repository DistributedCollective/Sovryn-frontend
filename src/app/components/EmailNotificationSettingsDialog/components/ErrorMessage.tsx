import React, { useMemo } from 'react';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

type ErrorMessageProps = {
  isValidEmail?: boolean;
  hasUnconfirmedEmail?: boolean;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  isValidEmail,
  hasUnconfirmedEmail,
}) => {
  const { t } = useTranslation();
  const renderMessage = useMemo(() => {
    if (!isValidEmail) {
      return t(translations.emailNotificationsDialog.invalidEmailWarning);
    }
    if (hasUnconfirmedEmail) {
      return t(translations.emailNotificationsDialog.unconfirmedEmailWarning);
    }
    return '';
  }, [t, isValidEmail, hasUnconfirmedEmail]);

  return !isValidEmail || hasUnconfirmedEmail ? (
    <ErrorBadge className="tw-mt-0" content={renderMessage} />
  ) : null;
};
