import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Button } from 'app/components/Button';
import { Timer } from './components/Timer/index';

interface IBannerProps {
  date: number;
  title: string;
  image: string;
  learnLink: string;
  buyLink: string;
}

export const Banner: React.FC<IBannerProps> = ({
  date,
  title,
  image,
  learnLink,
  buyLink,
}) => {
  const { t } = useTranslation();
  const now = new Date().getTime();
  const [isLive, setIsLive] = useState(date < now);

  return (
    <div className="tw-relative tw-w-full tw-h-full">
      <img
        src={image}
        className="tw-w-full tw-h-full tw-object-cover tw-object-left tw-rounded-2xl tw-border tw-border-solid tw-border-turquoise2"
        alt={title}
      />
      <div className="tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0 tw-p-4">
        <div className="tw-text-center tw-text-white tw-text-3xl tw-font-semibold">
          {title}
        </div>
        <div className="tw-flex tw-flex-col tw-items-end tw-mt-4">
          <div>
            {!isLive && (
              <>
                <Timer
                  expiryTimestamp={date}
                  onExpire={() => setIsLive(true)}
                />

                <a
                  className="tw-w-full tw-mt-4 tw-flex tw-no-underline"
                  href={learnLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    className="tw-w-full"
                    text={t(translations.landingPage.banner.learnMore)}
                  />
                </a>
              </>
            )}
            {isLive && (
              <>
                <div className="tw-bg-gray-1 tw-px-14 tw-py-5 tw-rounded-10px tw-text-3xl tw-font-semibold tw-text-center">
                  {t(translations.landingPage.banner.liveNow)}
                </div>
                <Link className="tw-w-full tw-mt-4 tw-flex" to={buyLink}>
                  <Button
                    className="tw-w-full"
                    text={t(translations.landingPage.banner.buyNow)}
                    onClick={() => {}}
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
