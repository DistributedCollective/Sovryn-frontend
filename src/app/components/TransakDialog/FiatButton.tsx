import { Button } from '@blueprintjs/core';
import React from 'react';
import { translations } from 'locales/i18n';
import { Trans } from 'react-i18next';
import { Asset } from 'types/asset';
import { AssetRenderer } from '../AssetRenderer';

type FiatButtonProps = {
  loading: boolean;
  ready: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export const FiatButton: React.FC<FiatButtonProps> = ({
  loading,
  ready,
  onClick,
  disabled,
}) => {
  return (
    <>
      <div className="tw-justify-center tw-items-center tw-flex tw-flex-row tw-w-full">
        <Button
          minimal
          className="button-round tw-text-primary tw-text-lg tw-mx-auto"
          text={
            <Trans
              i18nKey={translations.transakDialog.cta}
              components={[<AssetRenderer asset={Asset.RBTC} />]}
            />
          }
          loading={loading}
          disabled={loading || !ready || disabled}
          onClick={onClick}
        />
      </div>
    </>
  );
};
