import React, { useMemo } from 'react';
import blockies from 'ethereum-blockies';
import { prettyTx } from 'utils/helpers';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

type HeaderProps = {
  address: string;
};

export const FastBtcHeader: React.FC<HeaderProps> = ({ address }) => {
  const { t } = useTranslation();
  const blockieImage = useMemo(() => {
    return blockies
      .create({
        // All options are optional
        seed: address, // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 8, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
      })
      .toDataURL();
  }, [address]);

  return (
    <header className="tw-absolute tw-whitespace-nowrap tw-top-2 md:tw-top-16 tw-right-16 tw-left-4 tw-z-50 tw-flex tw-flex-row tw-items-center tw-justify-between md:tw-justify-end tw-space-x-4">
      <div className="tw-truncate md:tw-hidden">
        <Link to="/portfolio">{t(translations.common.back)}</Link>
      </div>
      <div className="tw-max-w-60 tw-bg-gray-2.5 tw-rounded-3xl engage-wallet tw-flex tw-items-center tw-px-4 tw-py-1.5 tw-justify-end tw-truncate">
        <span className="tw-font-semibold">
          {prettyTx(address || '', 4, 4)}
        </span>
        <span className="tw-pl-2">
          <img
            className="tw-rounded-full"
            src={blockieImage}
            alt="wallet address"
          />
        </span>
      </div>
    </header>
  );
};
