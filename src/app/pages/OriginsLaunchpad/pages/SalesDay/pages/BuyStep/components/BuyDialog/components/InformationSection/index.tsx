import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Asset } from 'types';
import { useInterval } from 'app/hooks/useInterval';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { InfoItem } from './InfoItem';
import { ISaleInformation } from '../../../../../../../../types';
import styles from './index.module.scss';

interface IInformationSectionProps {
  saleName: string;
  info: ISaleInformation;
}

export const InformationSection: React.FC<IInformationSectionProps> = ({
  saleName,
  info,
}) => {
  const { t } = useTranslation();
  const [countDown, setCountDown] = useState('');

  useInterval(() => {
    // const { saleStart, period } = info;
    let saleStart = 1637465681,
      period = 0; // test for countdown
    const diffTS =
      Number(saleStart) + Number(period) - Math.floor(Date.now() / 1000);
    const dd = Math.floor(diffTS / 86400);
    const hh = (Math.floor(diffTS / 3600) % 24).toString().padStart(2, '0');
    const mm = (Math.floor(diffTS / 60) % 60).toString().padStart(2, '0');
    const ss = (diffTS % 60).toString().padStart(2, '0');

    setCountDown((dd ? `${dd}d : ` : '') + `${hh}h : ${mm}m : ${ss}s`);
  }, 1000);

  return (
    <div className={styles.buyInformationWrapper}>
      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .totalDepositReceived,
        )}
        value={
          <>
            <span className="tw-pr-1 tw-font-orbitron">
              {weiToFixed(info.totalReceived, 4)}
            </span>
            <AssetSymbolRenderer
              asset={Asset.SOV}
              assetClassName="tw-font-orbitron"
            />
          </>
        }
        className="tw-text-primary"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .tokenPrice,
        )}
        value={
          <>
            {1 / info.depositRate}{' '}
            <AssetSymbolRenderer asset={info.depositToken} />
          </>
        }
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .participatingWallets,
        )}
        value={`${info.participatingWallets}`}
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .acceptedCurrencies,
        )}
        value={
          <>
            {[Asset.RBTC, Asset.SOV, Asset.XUSD, Asset.ETH, Asset.BNB].map(
              (asset, i) => (
                <React.Fragment key={asset}>
                  {i > 0 ? ', ' : ''}
                  <AssetSymbolRenderer
                    asset={asset}
                    assetClassName="tw-font-orbitron"
                  />
                </React.Fragment>
              ),
            )}
          </>
        }
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .tokenSaleEndTime,
        )}
        value={countDown}
        isLastItem={true}
      />
    </div>
  );
};
