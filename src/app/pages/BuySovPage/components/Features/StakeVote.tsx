import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import banner from 'assets/sov/staking.svg';

import { translations } from '../../../../../locales/i18n';

export function StakeVote() {
  const { t } = useTranslation();
  return (
    <Article className="tw-w-full">
      <h2 className="tw-block tw-text-center">
        {t(translations.buySovPage.features.stake.title)}
      </h2>
      <Banner src={banner} alt="Banner" />
      <div className="content tw-font-extralight tw-leading-snug">
        {t(translations.buySovPage.features.stake.text)}{' '}
        <a
          href="https://wiki.sovryn.app/en/governance/staking-vesting-voting#staking-sov"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t(translations.buySovPage.features.learnMore)}
        </a>
      </div>
      <div className="tw-container tw-text-center">
        <a
          href="https://live.sovryn.app/stake"
          className="button"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t(translations.buySovPage.features.stake.cta)}
        </a>
      </div>
    </Article>
  );
}

const Article = styled.article`
  max-width: 1200px;
  margin: 300px auto 70px;
  font-size: 1rem;
  font-weight: 400;
  h2 {
    text-transform: none;
    font-size: 2.5rem;
    line-height: 1.25;
    font-weight: 700;
    margin-bottom: 70px;
  }

  .content {
    width: 780px;
    margin: 0 auto 30px;
  }

  .button {
    width: 200px;
    height: 40px;
    background: #2274a5;
    border: 1px solid #2274a5;
    color: #e8e8e8;
    font-size: 1rem;
    line-height: 1;
    font-weight: 500;
    display: inline-block;
    border-radius: 0.75rem;
    text-decoration: none;
    text-align: center;
    padding: 11px;
    &:hover {
      opacity: 0.75;
      color: #e8e8e8;
    }
  }

  a {
    text-decoration: underline;
    color: var(--primary);
    &:hover {
      color: var(--primary);
      text-decoration: none;
    }
  }
`;

const Banner = styled.img`
  width: 100%;
  margin-bottom: 23px;
`;
