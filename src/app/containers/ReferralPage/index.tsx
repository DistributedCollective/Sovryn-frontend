/**
 *
 * ReferralPage
 *
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  TelegramShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Text, Tooltip } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { EventData } from 'web3-eth-contract';

import iconDuplicate from 'assets/images/icon-duplicate.svg';
import iconTwitter from 'assets/images/icon-twitter.svg';
import iconTelegram from 'assets/images/icon-telegram.svg';
import iconLinkedin from 'assets/images/icon-linkedin.svg';
import iconFacebook from 'assets/images/icon-facebook.svg';
import refBanner from 'assets/images/referral_banner.svg';

import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetDetails } from 'utils/models/asset-details';
import { weiToNumberFormat } from 'utils/display-text/format';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { toaster } from 'utils/toaster';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ReferralHistory } from '../../containers/ReferralHistory';
import { useAccount } from 'app/hooks/useAccount';
import { prettyTx } from 'utils/helpers';
import { useIsConnected } from 'app/hooks/useAccount';
import { useAffiliates_getReferralsList } from 'app/hooks/affiliates/useAffiliates_getReferralsList';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { CalculatedEvent } from 'app/containers/ReferralHistory';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { ActionButton } from 'app/components/Form/ActionButton';

type CustomEventData = EventData & { eventDate: string };

type EarnedFees = {
  [asset: string]: number;
};

export function ReferralPage() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  if (connected) {
    return <InnerReferralPage />;
  }

  return (
    <>
      <Header />
      <Main>
        <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12 font-family-montserrat">
          <h1 className="tw-text-center tw-w-full mt-4 mb-5">
            {t(translations.referral.title)}
          </h1>
          <div className="w-full bg-gray-light text-center rounded-b shadow p-3">
            <i>{t(translations.referral.isConnected)}</i>
          </div>
        </div>
      </Main>
      <Footer />
    </>
  );
}

function InnerReferralPage() {
  const { t } = useTranslation();
  const account = useAccount();
  const referralUrl = `https://live.sovryn.app/?ref=${account}`;
  const { value: referralList } = useAffiliates_getReferralsList(account);
  const assets = AssetsDictionary.list().filter(
    item => ![Asset.CSOV, Asset.SOV].includes(item.asset),
  );
  const { events: pastEvents, loading } = useGetContractPastEvents(
    'affiliates',
    'PayTradingFeeToAffiliate',
    { referrer: account },
  );

  const [events, setEvents] = useState<CalculatedEvent[]>([]);
  const [sovEarned, setSovEarned] = useState<number>(0);
  const [feesEarned, setFeesEarned] = useState<EarnedFees>({});

  const parseEvents = useCallback((rawEvents: CustomEventData[] = []) => {
    let feesTotal = assets.reduce(
      (a, val: AssetDetails) => Object.assign(a, { [val.asset]: 0 }),
      {},
    );
    let sovTotal = 0;
    const parsed: CalculatedEvent[] = rawEvents.map((val: CustomEventData) => {
      const tokenAsset = AssetsDictionary.getByTokenContractAddress(
        val.returnValues.token,
      ).asset;
      if (feesTotal.hasOwnProperty(tokenAsset))
        feesTotal[tokenAsset] += Number(val.returnValues.tradingFeeTokenAmount);
      if (Number(val.returnValues.sovBonusAmountPaid) > 0)
        sovTotal += Number(val.returnValues.sovBonusAmountPaid);
      return {
        blockNumber: val.blockNumber,
        eventDate: val.eventDate,
        transactionHash: val.transactionHash,
        referrer: val.returnValues.referrer,
        trader: val.returnValues.trader,
        token: tokenAsset,
        tradingFeeTokenAmount: val.returnValues.tradingFeeTokenAmount,
        tokenBonusAmount: val.returnValues.tokenBonusAmount,
        sovBonusAmount: val.returnValues.sovBonusAmount,
        sovBonusAmountPaid: val.returnValues.sovBonusAmountPaid,
      };
    });
    setFeesEarned(feesTotal);
    setSovEarned(sovTotal);
    setEvents(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log('PayTradingFeeToAffiliate', pastEvents, loading);
    if (account) {
      parseEvents(pastEvents as CustomEventData[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, JSON.stringify(pastEvents)]);

  return (
    <>
      <Header />
      <Main>
        <div className="tw-container tw-mx-auto tw-px-4 tw-mt-12 font-family-montserrat">
          <Banner>
            <Img className="xl:tw-absolute" src={refBanner} alt="banner" />
            <h1 className="tw-text-center tw-w-full mt-4 mb-5">
              {t(translations.referral.title)}
            </h1>
            <div className="xl:tw-flex pt-3">
              <div className="xl:tw-w-1/3"></div>
              <div className="tw-text-center">
                <div className="tw-text-center mb-3">
                  <b>{t(translations.referral.refLink)}</b>
                </div>
                <div className="ref-link bg-secondary tw-mt-4 tw-mx-6 tw-rounded tw-cursor-pointer tw-text-white tw-rounded">
                  <CopyToClipboard
                    text={referralUrl}
                    onCopy={() =>
                      toaster.show(
                        {
                          message: t(translations.referral.linkCopied),
                          intent: 'success',
                        },
                        'link-copy',
                      )
                    }
                  >
                    <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-between tw-items-center tw-pl-6">
                      <Text className="tw-font-thin" ellipsize>
                        {prettyTx(`live.sovryn.app/?ref=${account}`, 28, 6)}
                      </Text>
                      <div className="tw-ml-10 tw-rounded-r btn-copy">
                        <img src={iconDuplicate} alt="Copy" />
                      </div>
                    </div>
                  </CopyToClipboard>
                </div>
                <div className="ref-socials">
                  <TwitterShareButton
                    resetButtonStyle={false}
                    title="Stay Sovryn"
                    url={referralUrl}
                  >
                    <img src={iconTwitter} alt="iconTwitter" />
                  </TwitterShareButton>

                  <TelegramShareButton
                    resetButtonStyle={false}
                    title="Stay Sovryn"
                    url={referralUrl}
                  >
                    <img src={iconTelegram} alt="iconTelegram" />
                  </TelegramShareButton>

                  <LinkedinShareButton
                    resetButtonStyle={false}
                    title="Stay Sovryn"
                    url={referralUrl}
                  >
                    <img src={iconLinkedin} alt="iconLinkedin" />
                  </LinkedinShareButton>

                  <FacebookShareButton
                    resetButtonStyle={false}
                    title="Stay Sovryn"
                    url={referralUrl}
                  >
                    <img src={iconFacebook} alt="iconFacebook" />
                  </FacebookShareButton>
                </div>
              </div>
              <div className="xl:tw-w-1/3">
                <p className="ref-info">
                  <Trans i18nKey={translations.referral.text}>
                    Expand your Sovryn Web Of Trust to earn
                    <strong>$SOV bonus rewards and .01% of fees</strong> on
                    every transaction made by new wallets created with your
                    unique referral link.
                  </Trans>
                  <br />
                  <a href="#!" target="_blank">
                    {t(translations.referral.terms)}
                  </a>
                </p>
              </div>
            </div>
          </Banner>
          <div className="tw-flex tw-flex-wrap xl:tw-flex-nowrap tw-items-stretch tw-justify-around ref-rewards">
            <div className="xl:tw-mx-2 tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/3 md:tw-w-1/2 tw-w-full tw-text-center xl:tw-text-left tw-mb-5 xl:tw-mb-0">
              <p className="tw-text-lg tw--mt-1">
                {t(translations.referral.numberReferrals)}
              </p>
              <p className="xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6">
                {referralList?.length || 0}
              </p>
            </div>
            <div className="xl:tw-mx-2 tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/3 md:tw-w-1/2 tw-w-full tw-text-center xl:tw-text-left tw-mb-5 xl:tw-mb-0">
              <p className="tw-text-lg tw--mt-1">
                {t(translations.referral.rewardSOVEarned)}
              </p>
              <div className="tw-text-2xl tw-mt-2 tw-mb-6">
                <div className="tw-mb-3">
                  {sovEarned > 0 ? (
                    <Tooltip content={weiTo18(sovEarned)} className="tw-block">
                      <div>{weiToNumberFormat(sovEarned, 12)} SOV</div>
                    </Tooltip>
                  ) : (
                    '0 SOV'
                  )}
                </div>
                <ActionButton
                  text={t(translations.referral.claim)}
                  onClick={() => {}}
                  className="tw-block tw-w-1/2 tw-rounded-lg"
                  textClassName="tw-text-base"
                  disabled={true}
                />
              </div>
            </div>
            <div className="xl:tw-mx-2 tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/3 md:tw-w-1/2 tw-w-full tw-text-center xl:tw-text-left tw-mb-5 xl:tw-mb-0">
              <p className="tw-text-lg">
                {t(translations.referral.feesEarned)}
              </p>
              <div className="xl:tw-text-base tw-text-sm tw-mt-2 tw-mb-6">
                <div className="tw-mb-3">
                  {loading || !feesEarned ? (
                    <>
                      <div className="bp3-skeleton tw-h-5" />
                      <div className="bp3-skeleton tw-h-5 tw-mt-2" />
                    </>
                  ) : (
                    Object.entries(feesEarned).map(
                      ([key, fee]) =>
                        fee > 0 && (
                          <Tooltip content={weiTo18(fee)} className="tw-block">
                            <>
                              {weiToNumberFormat(fee, 14)}{' '}
                              <AssetSymbolRenderer asset={key as Asset} />
                            </>
                          </Tooltip>
                        ),
                    )
                  )}
                </div>
                <ActionButton
                  text={t(translations.referral.claim)}
                  onClick={() => {}}
                  className="tw-block tw-w-1/2 tw-rounded-lg"
                  textClassName="tw-text-base"
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <p className="tw-text-lg tw-mt-14 tw-mb-2">
            {t(translations.referral.referralHistory)}
          </p>
          <ReferralHistory items={events} referralList={referralList} />
        </div>
      </Main>
      <Footer />
    </>
  );
}

const Img = styled.img`
  width: 19.688rem;
  height: 18.813rem;
  left: 3rem;
  top: 1.5rem;
  margin: 0 auto;
`;

const Main = styled.main`
  max-width: 100.625rem;
  margin: 0 auto;
  .ref-rewards {
    background: transparent
      radial-gradient(closest-side at 50% 105%, #e9eae9 0%, #222222 100%) 0% 0%
      no-repeat padding-box;
    mix-blend-mode: lighten;
    border-radius: 0.5rem;
    margin: 2rem 0;
    padding: 1.7rem 0 1.5rem 2.5rem;
    p {
      &:first-child {
        font-size: 1rem;
      }
      &:last-child {
        font-size: 2rem;
      }
    }
  }
`;

const Banner = styled.div`
  background: transparent linear-gradient(258deg, #89aea2 0%, #34252c 100%) 0%
    0% no-repeat padding-box;
  border: 0.375rem solid #f7f6e7;
  position: relative;
  padding: 0 5rem 3rem;
  min-height: 23.8rem;
  b {
    letter-spacing: 0.063rem;
  }
  h1 {
    text-align: center;
    font-size: 2.25rem;
    line-height: 2.938rem;
    font-weight: bold;
    letter-spacing: 0;
    color: #d9d9d9;
    text-transform: none;
  }
  .ref-link {
    height: 2.5rem;
    line-height: 2.5rem;
    padding: 0;
    font: normal normal normal 0.875rem/2.5rem Montserrat;
    letter-spacing: 0;
    color: white;
    display: inline-block;
    margin: 0 auto;
    border-radius: 0.313rem;
    .btn-copy {
      background: #575757 0% 0% no-repeat;
      border-radius: 0 0.313rem 0.313rem 0;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
      &:hover {
        background: rgba(87, 87, 87, 50%) 0% 0% no-repeat;
      }
    }
  }
  .ref-socials {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.1rem;
    margin-bottom: 2rem;
    button {
      width: 2.375rem;
      height: 2.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fec004;
      margin: 0 0.5rem;
      border-radius: 50%;
      transition: all 0.3s;
      padding: 0;
      &:hover {
        transform: scale(1.1);
      }
      img {
        max-width: 1.375rem;
      }
    }
  }
  .ref-info {
    text-align: left;
    font-size: 1rem;
    line-height: 1.313rem;
    letter-spacing: 0;
    color: #ededed;
    padding: 0 2rem 0 4.7rem;
    b {
      letter-spacing: 0.063rem;
      display: block;
    }
    a {
      color: #ededed;
      text-decoration: underline;
      &:hover {
        text-decoration: none;
      }
    }
  }
`;
