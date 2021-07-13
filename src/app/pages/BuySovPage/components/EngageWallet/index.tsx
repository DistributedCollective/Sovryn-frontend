import React from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { Card } from '../Card';
import { Button } from '../Button';
import { useIsConnected } from '../../../../hooks/useAccount';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';

export function EngageWalletStep() {
  const { t } = useTranslation();
  const { connect } = useWalletContext();
  const connected = useIsConnected();
  return (
    <Card
      step={1}
      title={t(translations.buySovPage.engage.title)}
      disabled={connected}
    >
      <div className="disable-content mb-4" style={{ height: 180 }}>
        <p className="mb-3">
          <Trans
            i18nKey={translations.buySovPage.engage.line1}
            components={[
              <a
                href="https://rsk.co"
                target="_blank"
                rel="noreferrer noopener"
              >
                RSK Mainnet
              </a>,
            ]}
          />
        </p>
        <p>
          <Trans
            i18nKey={translations.buySovPage.engage.line2}
            components={[
              <a
                href="https://liquality.io/atomic-swap-wallet.html"
                target="_blank"
                rel="noreferrer noopener"
              >
                Liquality wallet
              </a>,
            ]}
          />
        </p>
      </div>
      <Button
        text={t(translations.buySovPage.engage.cta)}
        disabled={connected}
        onClick={() => connect()}
      />
    </Card>
  );
}
