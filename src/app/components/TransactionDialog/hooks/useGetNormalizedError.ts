import { translations } from 'locales/i18n';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectRequestDialogState } from 'store/global/transactions-store/selectors';

export const useGetNormalizedError = () => {
  const { t } = useTranslation();
  const { error } = useSelector(selectRequestDialogState);

  const hasUserDeclinedTx = useMemo(
    () =>
      error?.includes('User denied transaction signature') ||
      error?.includes('UserDeclinedError'),
    [error],
  );

  const normalizedError = useMemo(() => {
    if (hasUserDeclinedTx) {
      return t(translations.walletProvider.userDenied);
    }
    return error;
  }, [hasUserDeclinedTx, error, t]);

  return {
    hasUserDeclinedTx,
    normalizedError,
  };
};
