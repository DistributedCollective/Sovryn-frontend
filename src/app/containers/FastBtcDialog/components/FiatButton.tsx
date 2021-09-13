import { Button } from '@blueprintjs/core';
import React from 'react';
import { translations } from 'locales/i18n';
import { Trans } from 'react-i18next';
import { AssetRenderer } from '../../../components/AssetRenderer';
import { Asset } from '../../../../types/asset';

interface Props {
  loading: boolean;
  ready: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function FiatButton({ loading, ready, onClick, disabled }: Props) {
  return (
    <>
      <div className="tw-justify-center tw-items-center tw-flex tw-flex-row tw-w-full">
        <Button
          minimal
          className="button-width button-round tw-text-primary tw-text-lg tw-mx-auto"
          text={
            <Trans
              i18nKey={translations.fastBtcDialog.fiatDialog.title}
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
}
