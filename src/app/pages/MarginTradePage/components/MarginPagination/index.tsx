import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Button, ButtonStyle } from 'app/components/Button';

interface IMarginPaginationProps {
  page: number;
  loading: boolean;
  isDisabled: boolean;
  onChange: (value: number) => void;
}

export const MarginPagination: React.FC<IMarginPaginationProps> = ({
  page,
  onChange,
  isDisabled,
  loading,
}) => {
  const { t } = useTranslation();

  const handleMoveRight = useCallback(() => {
    onChange(page + 1);
  }, [onChange, page]);

  const handleMoveLeft = useCallback(() => {
    onChange(page - 1);
  }, [onChange, page]);

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-my-5">
      <Button
        text={t(translations.common.previous)}
        onClick={handleMoveLeft}
        loading={loading}
        style={ButtonStyle.link}
        disabled={page === 1 || loading}
        className="tw-mr-1"
      />
      <div className="tw-text-lg tw-mx-5 tw-font-semibold">{page}</div>
      <Button
        text={t(translations.common.next)}
        onClick={handleMoveRight}
        loading={loading}
        style={ButtonStyle.link}
        disabled={isDisabled || loading}
        className="tw-ml-1"
      />
    </div>
  );
};
