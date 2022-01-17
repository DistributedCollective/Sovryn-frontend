import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types/asset';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Trans } from 'react-i18next';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TransakDialog } from 'app/components/TransakDialog/TransakDialog';

export const TopUpWallet: React.FC = () => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const { value: balance } = useAssetBalanceOf(Asset.RBTC);
  const [open, setOpen] = useState(false);
  return (
    <Card
      step={2}
      title={
        <Trans
          i18nKey={translations.buySovPage.topUp.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      }
      disabled={balance !== '0'}
    >
      <div className="disable-content" style={{ height: 180 }}>
        <p>
          {' '}
          <Trans
            i18nKey={translations.buySovPage.topUp.line1}
            components={[<AssetRenderer asset={Asset.RBTC} />]}
          />
        </p>
        <p>
          <br />
          <a href="https://rsk.co" target="_blank" rel="noreferrer noopener">
            <Trans
              i18nKey={translations.buySovPage.topUp.line2}
              components={[<AssetRenderer asset={Asset.RBTC} />]}
            />
          </a>
        </p>
      </div>
      <Button
        text={t(translations.buySovPage.topUp.cta)}
        disabled={!connected}
        onClick={() => setOpen(true)}
      />
      <TransakDialog isOpen={open} onClose={() => setOpen(false)} />
    </Card>
  );
};
