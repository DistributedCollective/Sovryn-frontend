import React, { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { CrossChainLayout } from 'app/components/CrossChain/CrossChainLayout';
import { SelectBox } from '../BridgeDepositPage/components/SelectBox';
import btcIcon from 'assets/images/BTC.svg';

import dollarIcon from 'assets/images/fiat/dollar.svg';
import eruoIcon from 'assets/images/fiat/euro.svg';
import poundIcon from 'assets/images/fiat/pound.svg';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Tooltip } from '@blueprintjs/core';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite, POWPEG_LINK } from 'utils/classifiers';

export const ReceiveRBTCPage: React.FC = () => {
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcReceiveLocked = checkMaintenance(States.FASTBTC_RECEIVE);
  const transakLocked = checkMaintenance(States.TRANSAK);

  const onBtcClicked = useCallback(
    e => {
      if (fastBtcReceiveLocked) {
        e.preventDefault();
      }
    },
    [fastBtcReceiveLocked],
  );

  const fastBtcButton = useMemo(
    () => (
      <Link onClick={onBtcClicked} to="/fast-btc/deposit">
        <SelectBox disabled={fastBtcReceiveLocked}>
          <img src={btcIcon} alt="btc" />
        </SelectBox>
      </Link>
    ),
    [fastBtcReceiveLocked, onBtcClicked],
  );

  const powPegButton = useMemo(
    () => (
      <a href={POWPEG_LINK} target="_blank" rel="noreferrer noopener">
        <SelectBox>
          <img src={btcIcon} alt="PowPeg" />
        </SelectBox>
      </a>
    ),
    [],
  );

  const onBankClicked = useCallback(
    e => {
      if (fastBtcReceiveLocked || transakLocked) {
        e.preventDefault();
      }
    },
    [fastBtcReceiveLocked, transakLocked],
  );

  const bankButton = useMemo(
    () => (
      <Link to="/fast-btc/transak" onClick={onBankClicked}>
        <SelectBox disabled={fastBtcReceiveLocked || transakLocked}>
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
      </Link>
    ),
    [fastBtcReceiveLocked, transakLocked, onBankClicked],
  );

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
            minHeight: 510,
            width: 780,
            maxWidth: 'calc(100vw - 22rem)',
          }}
          className="tw-py-4 tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-relative"
        >
          <div className="tw-mb-20 tw-text-base tw-text-center tw-font-semibold">
            {t(translations.receiveRBTCPage.selectSource)}
          </div>
          <div className="tw-flex tw-flex-wrap tw-items-stretch tw-justify-center">
            <div className="tw-text-center tw-h-full">
              {powPegButton}
              <p className="tw-mt-3 tw-font-medium">
                {t(translations.receiveRBTCPage.powPeg)}
              </p>
              {/* <p className="tw-mt-3 tw-mb-1 tw-font-medium">
                {t(translations.receiveRBTCPage.powPeg)} <br />
              </p>

              <p className="tw-my-0 tw-text-xs tw-font-medium tw-text-success-50">
                {t(translations.common.recommended)}
              </p> */}
            </div>

            <div className="tw-text-center tw-h-full">
              {fastBtcReceiveLocked ? (
                <Tooltip
                  position="top"
                  hoverOpenDelay={0}
                  hoverCloseDelay={0}
                  interactionKind="hover"
                  content={
                    <>
                      <Trans
                        i18nKey={translations.maintenance.fastBTC}
                        components={[
                          <a
                            href={discordInvite}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="tw-underline hover:tw-no-underline"
                          >
                            x
                          </a>,
                        ]}
                      />
                    </>
                  }
                >
                  {fastBtcButton}
                </Tooltip>
              ) : (
                fastBtcButton
              )}
              <p className="tw-mt-3 tw-font-medium">
                {t(translations.receiveRBTCPage.fastBtc)}
              </p>
            </div>

            <div className="tw-text-center tw-h-full">
              {fastBtcReceiveLocked || transakLocked ? (
                <Tooltip
                  position="top"
                  hoverOpenDelay={0}
                  hoverCloseDelay={0}
                  interactionKind="hover"
                  content={
                    <>
                      {fastBtcReceiveLocked ? (
                        <Trans
                          i18nKey={translations.maintenance.fastBTC}
                          components={[
                            <a
                              href={discordInvite}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="tw-underline hover:tw-no-underline"
                            >
                              x
                            </a>,
                          ]}
                        />
                      ) : (
                        <Trans
                          i18nKey={translations.maintenance.transack}
                          components={[
                            <a
                              href={discordInvite}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="tw-underline hover:tw-no-underline"
                            >
                              x
                            </a>,
                          ]}
                        />
                      )}
                    </>
                  }
                >
                  {bankButton}
                </Tooltip>
              ) : (
                bankButton
              )}

              <Tooltip
                position="bottom"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                className="tw-block"
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
