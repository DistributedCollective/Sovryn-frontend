import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { Asset } from '../../../../../types/asset';
import { FastBtcDialog } from '../../../../containers/FastBtcDialog';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function TopUpWallet() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const { value: balance } = useAssetBalanceOf(Asset.RBTC);
  const [open, setOpen] = useState(false);
  return (
    <Card
      step={2}
      title={t(translations.buySovPage.topUp.title)}
      disabled={balance !== '0'}
    >
      <div className="disable-content" style={{ height: 180 }}>
        <p>{t(translations.buySovPage.topUp.line1)}</p>
        <p>
          <br />
          <a href="https://rsk.co" target="_blank" rel="noreferrer noopener">
            {t(translations.buySovPage.topUp.line2)}
          </a>
        </p>
      </div>
      <Button
        text={t(translations.buySovPage.topUp.cta)}
        disabled={!connected}
        onClick={() => setOpen(true)}
      />
      <FastBtcDialog isOpen={open} onClose={() => setOpen(false)} />
    </Card>
  );
}
