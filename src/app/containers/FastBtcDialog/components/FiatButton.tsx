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
      <div className="justify-content-center items-center d-flex flex-row w-100">
        <Button
          minimal
          className="text-gold button-width button-round font-size-lg mx-auto"
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
