import React from 'react';
import { Helmet } from 'react-helmet-async';

import { CrossChainLayout } from 'app/components/CrossChain/CrossChainLayout';
import { SelectBox } from '../BridgeDepositPage/components/SelectBox';
import btcIcon from 'assets/images/BTC.svg';

import dollarIcon from 'assets/images/fiat/dollar.svg';
import eruoIcon from 'assets/images/fiat/euro.svg';
import poundIcon from 'assets/images/fiat/pound.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTransak } from 'app/components/TransakDialog/useTransak';
import { Tooltip } from '@blueprintjs/core';

export const ReceiveRBTCPage: React.FC = () => {
  const { t } = useTranslation();
  const { handleClick, isWrongChainId } = useTransak();

  return (
    <>
      <Helmet>
        <title>{t(translations.receiveRBTCPage.title)}</title>
        <meta
          name="description"
          content={t(translations.receiveRBTCPage.description)}
        />
      </Helmet>

      <CrossChainLayout
        title={t(translations.receiveRBTCPage.title)}
        subtitle={t(translations.receiveRBTCPage.description)}
      >
        <div
          style={{
            minHeight: 610,
            width: 780,
            maxWidth: 'calc(100vw - 22rem)',
          }}
          className="tw-py-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-relative"
        >
          <div className="tw-mb-20 tw-text-base tw-text-center tw-font-semibold">
            {t(translations.receiveRBTCPage.selectSource)}
          </div>
          <div className="tw-flex tw-items-center tw-justify-center">
            <div className="tw-text-center">
              <Link to="/fast-btc/deposit">
                <SelectBox>
                  <img src={btcIcon} alt="btc" />
                </SelectBox>
              </Link>
              <p className="tw-mt-3 tw-font-medium">
                {t(translations.receiveRBTCPage.bitcoinNetwork)}
              </p>
            </div>

            <div className="tw-text-center">
              <SelectBox disabled={isWrongChainId} onClick={handleClick}>
                <div className="tw-flex">
                  <div className="tw-z-20 tw-border tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={dollarIcon} alt="dollar" />
                  </div>
                  <div className="tw-z-10 tw-border tw--ml-5 tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={poundIcon} alt="pound" />
                  </div>
                  <div className="tw-border tw--ml-5 tw-border-gray-5 tw-bg-gray-4 tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full">
                    <img src={eruoIcon} alt="euro" />
                  </div>
                </div>
              </SelectBox>
              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                className="tw-block"
                disabled={!isWrongChainId}
                interactionKind="hover"
                content={t(translations.transakDialog.chainId)}
              >
                <p className="tw-mt-3 tw-font-medium">
                  {t(translations.receiveRBTCPage.bankCard)}
                </p>
              </Tooltip>
            </div>
          </div>
        </div>
      </CrossChainLayout>
    </>
  );
};
