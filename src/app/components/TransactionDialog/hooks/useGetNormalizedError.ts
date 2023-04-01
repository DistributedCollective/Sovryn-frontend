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

    if (error?.includes('LIQUALITY_ERROR_FROM_ERROR_PARSER_PACKAGE')) {
      const searchReason = error.match(
        /(?:\\"reason\\":\\")([A-Za-z0-9 ]+)(?=\\")/g,
      );
      if (searchReason?.length) {
        return searchReason[0];
      }

      const searchErrorName = error.match(
        /(?:\\"name\\":\\")([A-Za-z0-9 ]+)(?=\\")/g,
      );
      if (searchErrorName?.length) {
        return searchErrorName[0];
      }
    }
    return error;
  }, [hasUserDeclinedTx, error, t]);

  return {
    hasUserDeclinedTx,
    normalizedError,
  };
};
