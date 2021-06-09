import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  InstructionsSectionsWrapper,
  InstructionsTitle,
  MainInstructionsWrapper,
  NftInstructionsWrapper,
} from './styled';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';
import imgInstructions from 'assets/images/OriginsLaunchpad/FishSale/small_NFT.svg';

interface IInstructionsProps {
  saleName: string;
}

export const Instructions: React.FC<IInstructionsProps> = ({ saleName }) => {
  const { t } = useTranslation();

  return (
    <InstructionsSectionsWrapper>
      <InstructionsTitle>
        {t(translations.originsLaunchpad.saleDay.buyStep.instructions.title)}:
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
            tOptions={{ token: saleName }}
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
              <a
                href="http://discord.com/invite/J22WS6z"
                target="_blank"
                rel="noopener noreferrer"
              >
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
  );
};
