import React from 'react';
import { BuyInformationWrapper, BuyWrapper, DialogWrapper } from './styled';
import { InfoItem } from './components/InfoItem';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';

export const BuyStep: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-flex">
        <DialogWrapper>
          <BuyInformationWrapper>
            <div className="tw-mb-8 tw-text-left">
              <div className="tw-text-xs tw-tracking-normal tw-mb-3">
                {t(
                  translations.originsLaunchpad.saleDay.buyStep
                    .buyInformationLabels.depositLimits,
                )}
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
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.saleAllocation,
              )}
              value="32,508,000 FISH"
            />

            <InfoItem
              label={t(
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.allocationRemaining,
              )}
              value="333,333 FISH 25%"
              className="tw-text-primary"
            />

            <InfoItem
              label={t(
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.participatingWallets,
              )}
              value="15,253"
            />

            <InfoItem
              label={t(
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.price,
              )}
              value="1000 Sats"
            />

            <InfoItem
              label={t(
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.acceptedCurrencies,
              )}
              value={
                <>
                  <AssetSymbolRenderer asset={Asset.RBTC} />
                </>
              }
            />

            <InfoItem
              label={t(
                translations.originsLaunchpad.saleDay.buyStep
                  .buyInformationLabels.tokenSaleEndTime,
              )}
              value="8th Jan"
              isLastItem={true}
            />
          </BuyInformationWrapper>

          <BuyWrapper>Buy dialog</BuyWrapper>
        </DialogWrapper>

        <div className="tw-ml-24">Instruction</div>
      </div>
    </>
  );
};
