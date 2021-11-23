import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import imgInstructions from 'assets/origins_launchpad/MYNT_NFT_small.png';
import { discordInvite } from 'utils/classifiers';
import styles from './index.module.scss';

interface IInstructionsProps {
  saleName: string;
}

export const Instructions: React.FC<IInstructionsProps> = ({ saleName }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.instructionsSectionsWrapper}>
      <div className={styles.instructionsTitle}>
        {t(translations.originsLaunchpad.saleDay.buyStep.instructions.title)}:
      </div>

      <div className={styles.mainInstructionsWrapper}>
        <div>
          •{' '}
          <Trans
            i18nKey={
              translations.originsLaunchpad.saleDay.buyStep.instructions
                .instruction1
            }
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
              <a href={discordInvite} target="_blank" rel="noopener noreferrer">
                x
              </a>,
            ]}
            tOptions={{ discordUrl: discordInvite }}
          />
        </div>
      </div>

      <img
        src={imgInstructions}
        alt="instructions"
        className="tw-border-solid tw-border-4 tw-rounded tw-border-gray-9"
      />
    </div>
  );
};
