import React, { useContext, useMemo } from 'react';
import classNames from 'classnames';
import styles from './cross-chain-layout.module.css';
import { useTranslation } from 'react-i18next';
import blockies from 'ethereum-blockies';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';
import { WalletContext } from '@sovryn/react-wallet';
import { Chain } from 'types';
import { ReactComponent as Xmark } from 'assets/images/xmark.svg';

type CrossChainLayoutProps = {
  children: React.ReactNode;
  network?: Chain;
  title?: string;
  subtitle?: string;
};

export const CrossChainLayout: React.FC<CrossChainLayoutProps> = ({
  children,
  network = Chain.RSK,
  title,
  subtitle,
}) => {
  const { connected, address } = useContext(WalletContext);
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

  const backToUrl = useMemo(
    () => (network === Chain.BSC ? '/perpetuals' : '/wallet'),
    [network],
  );

  const backToTitle = useMemo(
    () =>
      network === Chain.BSC
        ? t(translations.fastBtcPage.backToPerpetuals)
        : t(translations.fastBtcPage.backToPortfolio),
    [network, t],
  );

  return (
    <div
      className={classNames(
        'tw-p-11 tw-bg-gray-1 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center',
        styles.page,
      )}
    >
      <div
        className="tw-rounded tw-w-full tw-bg-gray-3 tw-flex tw-justify-center tw-items-center tw-relative"
        style={{ minHeight: 'calc(100vh - 5.5rem)' }}
      >
        <header className="tw-absolute tw-whitespace-nowrap tw-top-4 tw-right-0 tw-w-full tw-px-8 tw-z-50 tw-flex tw-flex-row tw-items-start tw-justify-between">
          <Link
            to={backToUrl}
            className="tw-flex tw-items-center tw-font-semibold tw-cursor-pointer tw-select-none tw-text-white tw-whitespace-nowrap tw-no-underline"
          >
            <Xmark className="tw-w-4 tw-h-4 tw-mr-4" />
            {backToTitle}
          </Link>
          <div className="tw-text-center">
            {title && (
              <div className="tw-font-semibold tw-text-2xl">{title}</div>
            )}
            {subtitle && (
              <div className="tw-font-medium tw-text-base tw-mt-0">
                {subtitle}
              </div>
            )}
          </div>
          {connected && address && (
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
          )}
          {(!connected || !address) && <div className="tw-w-40" />}
        </header>
        <div className="tw-rounded tw-bg-gray-2.5 tw-mt-20 tw-mb-4">
          {children}
        </div>
      </div>
    </div>
  );
};
