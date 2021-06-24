/**
 *
 * ReferralPage
 *
 */

import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  TelegramShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Text } from '@blueprintjs/core';
import styled from 'styled-components/macro';

import iconDuplicate from 'assets/images/icon-duplicate.svg';
import iconTwitter from 'assets/images/icon-twitter.svg';
import iconTelegram from 'assets/images/icon-telegram.svg';
import iconLinkedin from 'assets/images/icon-linkedin.svg';
import iconFacebook from 'assets/images/icon-facebook.svg';
import refBanner from 'assets/images/referral_banner.svg';

import { translations } from 'locales/i18n';
import { toaster } from 'utils/toaster';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ReferralHistory } from '../../containers/ReferralHistory';
import { useAccount } from '../../hooks/useAccount';
import { prettyTx } from 'utils/helpers';
import { useIsConnected } from 'app/hooks/useAccount';
import { useAffiliates_getReferralsList } from 'app/hooks/affiliates/useAffiliates_getReferralsList';

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
  const referralList = useAffiliates_getReferralsList(account.toLowerCase());

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
              <div className="xl:tw-w-1/3 tw-text-center">
                <div className="tw-text-center mb-3">
                  <b>{t(translations.referral.refLink)}</b>
                </div>
                <div className="ref-link bg-secondary tw-py-1 tw-px-4 tw-mt-4 tw-mx-6 tw-rounded tw-cursor-pointer tw-text-white tw-rounded">
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
                    <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-between tw-items-center">
                      <Text className="px-3" ellipsize>
                        {prettyTx(`live.sovryn.app/?ref=${account}`, 24, 4)}
                      </Text>
                      <div className="tw-ml-4 btn-copy">
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
                {referralList?.value?.length || 0}
              </p>
            </div>
            <div className="xl:tw-mx-2 tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/3 md:tw-w-1/2 tw-w-full tw-text-center xl:tw-text-left tw-mb-5 xl:tw-mb-0">
              <p className="tw-text-lg tw--mt-1">
                {t(translations.referral.rewardSOVEarned)}
              </p>
              <p className="xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6">
                10.023302 SOV
              </p>
            </div>
            <div className="xl:tw-mx-2 tw-p-8 tw-pb-6 tw-rounded-2xl xl:tw-w-1/3 md:tw-w-1/2 tw-w-full tw-text-center xl:tw-text-left tw-mb-5 xl:tw-mb-0">
              <p className="tw-text-lg tw--mt-1">
                {t(translations.referral.feesEarned)}
              </p>
              <p className="xl:tw-text-4-5xl tw-text-3xl tw-mt-2 tw-mb-6">
                0.023302 RBTC
              </p>
            </div>
          </div>
          <p className="tw-text-lg mt-5">
            {t(translations.referral.referralHistory)}
          </p>
          <ReferralHistory />
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
