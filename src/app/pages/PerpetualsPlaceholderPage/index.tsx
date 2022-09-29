import React from 'react';
import placeholderImage from 'assets/images/perpetuals-shutdown/perpetuals_screenshot_without_header.png';
import { HeaderLabs } from 'app/components/HeaderLabs';
import {
  discordInvite,
  sovrynTelegram,
  sovrynTwitter,
  WIKI_PERPETUAL_FUTURES_LINK,
} from 'utils/classifiers';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { ReactComponent as SovLogo } from 'assets/images/perpetuals-shutdown/Logo.svg';
import { ReactComponent as DiscordLogo } from 'assets/images/perpetuals-shutdown/Discord.svg';
import { ReactComponent as TelegramLogo } from 'assets/images/perpetuals-shutdown/Telegram.svg';
import { ReactComponent as TwitterLogo } from 'assets/images/perpetuals-shutdown/Twitter.svg';
import { Picture } from 'app/components/Picture';
import { translations } from 'locales/i18n';

export const PerpetualsPlaceholderPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeaderLabs helpLink={WIKI_PERPETUAL_FUTURES_LINK} />
      <div className={styles.wrapper}>
        <Picture src={placeholderImage} />
        <div className={styles.overlay}>
          <SovLogo />
          <div className="tw-text-2xl tw-font-medium tw-mt-12 tw-max-w-2xl tw-text-center">
            {t(translations.perpetualPage.shutdown.message)}
          </div>
          <div className="tw-flex tw-mt-20">
            <a href={discordInvite} target="_blank" rel="noreferrer">
              <DiscordLogo />
            </a>
            <a
              href={sovrynTwitter}
              target="_blank"
              rel="noreferrer"
              className="tw-ml-2.5"
            >
              <TwitterLogo />
            </a>
            <a
              href={sovrynTelegram}
              target="_blank"
              rel="noreferrer"
              className="tw-ml-2.5"
            >
              <TelegramLogo />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
