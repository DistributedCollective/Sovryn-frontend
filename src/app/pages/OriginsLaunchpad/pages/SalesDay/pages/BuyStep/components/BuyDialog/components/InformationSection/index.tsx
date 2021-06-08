import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';
import { BuyInformationWrapper } from './styled';
import { InfoItem } from './InfoItem';
import { AllocationRemaining } from './AllocationRemaining';

export const InformationSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BuyInformationWrapper>
      <div className="tw-mb-8 tw-text-left">
        <div className="tw-text-xs tw-tracking-normal tw-mb-3">
          {t(
            translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
              .depositLimits,
          )}
          :
        </div>
        <div className="tw-text-xs">
          <div>
            • MIN: 0.001 <AssetSymbolRenderer asset={Asset.RBTC} />
          </div>
          <div>
            • MAX: 0.07 <AssetSymbolRenderer asset={Asset.RBTC} />
          </div>
        </div>
      </div>

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .saleAllocation,
        )}
        value="32,508,000 FISH"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .allocationRemaining,
        )}
        value={<AllocationRemaining />}
        className="tw-text-primary"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .participatingWallets,
        )}
        value="15,253"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .price,
        )}
        value="1000 Sats"
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .acceptedCurrencies,
        )}
        value={
          <>
            <AssetSymbolRenderer asset={Asset.RBTC} />
          </>
        }
      />

      <InfoItem
        label={t(
          translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
            .tokenSaleEndTime,
        )}
        value="8th Jan"
        isLastItem={true}
      />
    </BuyInformationWrapper>
  );
};
