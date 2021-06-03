import React from 'react';
import {
  BuyInformationWrapper,
  BuyWrapper,
  DialogWrapper,
  InstructionsSectionsWrapper,
  InstructionsTitle,
  MainInstructionsWrapper,
  NftInstructionsWrapper,
} from './styled';
import { InfoItem } from './components/InfoItem';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';
import imgInstructions from 'assets/images/OriginsLaunchpad/FishSale/small_NFT.svg';

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

        <InstructionsSectionsWrapper>
          <InstructionsTitle>
            {t(
              translations.originsLaunchpad.saleDay.buyStep.instructions.title,
            )}
            :
          </InstructionsTitle>

          <MainInstructionsWrapper>
            <div>
              •{' '}
              <Trans
                i18nKey={
                  translations.originsLaunchpad.saleDay.buyStep.instructions
                    .instruction1
                }
                components={[<AssetSymbolRenderer asset={Asset.RBTC} />]}
                tOptions={{ token: 'FISH' }}
              />
            </div>

            <div>
              •{' '}
              {t(
                translations.originsLaunchpad.saleDay.buyStep.instructions
                  .instruction2,
              )}
            </div>

            <div className="tw-mt-4">
              <Trans
                i18nKey={
                  translations.originsLaunchpad.saleDay.buyStep.instructions
                    .discordSupport
                }
                components={[
                  <a href="http://discord.com/invite/J22WS6z" target="_blank">
                    x
                  </a>,
                ]}
                tOptions={{ discordUrl: 'discord.com/invite/J22WS6z' }}
              />
            </div>
          </MainInstructionsWrapper>

          <img src={imgInstructions} alt="instructions" />

          <NftInstructionsWrapper>
            <div>
              {t(
                translations.originsLaunchpad.saleDay.buyStep.instructions
                  .nftInstruction1,
              )}
            </div>
            <div className="tw-mt-6">
              {t(
                translations.originsLaunchpad.saleDay.buyStep.instructions
                  .nftInstruction2,
              )}
            </div>
          </NftInstructionsWrapper>
        </InstructionsSectionsWrapper>
      </div>
    </>
  );
};
