import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { OriginClaimDialog } from './OriginClaimDialog';
import { useAccount } from 'app/hooks/useAccount';
import { Button } from 'app/components/Button';

export function OriginClaimBanner() {
  const { t } = useTranslation();
  const { value } = useCacheCallWithValue<string>(
    'OriginInvestorsClaim',
    'investorsAmountsList',
    '0',
    useAccount(),
  );

  const [isOpen, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(!isOpen), [isOpen]);

  return (
    <>
      {value !== '0' && (
        <div className="tw-flex tw-justify-between tw-items-center tw-w-full tw-p-5 lg:tw-p-8 tw-text-medium tw-mb-4 lg:tw-text-2xl tw-text-base tw-bg-primary tw-bg-opacity-25 tw-border-primary tw-border tw-rounded-lg">
          <p className="tw-mb-0 tw-mr-4">
            {t(translations.claimOriginBanner.text)}
          </p>
          <Button
            text={t(translations.claimOriginBanner.cta)}
            onClick={onClose}
          />
        </div>
      )}
      <OriginClaimDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
}
