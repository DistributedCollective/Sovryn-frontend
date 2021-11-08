import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Asset } from 'types';
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
        value={info.saleEnd}
        isLastItem={true}
      />
    </div>
  );
};
