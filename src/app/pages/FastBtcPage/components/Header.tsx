import React, { useMemo } from 'react';
import blockies from 'ethereum-blockies';
import cn from 'classnames';
import { prettyTx } from 'utils/helpers';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

type HeaderProps = {
  address: string;
};

const Header: React.FC<HeaderProps> = ({ address }) => {
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
    <div className="tw-absolute tw-whitespace-nowrap tw-top-2 md:tw-top-4 tw-right-4 tw-left-4 tw-z-50 tw-flex tw-flex-row tw-items-center tw-justify-between md:tw-justify-end tw-space-x-4">
      <div className="tw-truncate md:tw-hidden">
        <Link to="/wallet">{t(translations.common.back)}</Link>
      </div>
      <div
        className={cn(
          'tw-max-w-60 engage-wallet tw-w-full tw-flex tw-items-center tw-px-4 tw-justify-end tw-truncate',
        )}
      >
        <span>{prettyTx(address || '', 4, 4)}</span>
        <span className="tw-pl-2">
          <img className="tw-rounded" src={blockieImage} alt="wallet address" />
        </span>
      </div>
    </div>
  );
};

export default Header;
