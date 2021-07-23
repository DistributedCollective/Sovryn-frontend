import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import banner from 'assets/sov/staking.svg';

import { translations } from '../../../../../locales/i18n';

export function StakeVote() {
  const { t } = useTranslation();
  return (
    <Article className="w-100">
      <h1 className="d-block text-center">
        {t(translations.buySovPage.features.stake.title)}
      </h1>
      <Banner src={banner} alt="Banner" />
      <div className="content tw-font-thin tw-leading-snug">
        {t(translations.buySovPage.features.stake.text)}{' '}
        <a
          href="https://wiki.sovryn.app/en/governance/staking-vesting-voting#staking-sov"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t(translations.buySovPage.features.learnMore)}
        </a>
      </div>
      <div className="container text-center">
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
  font-size: 16px;
  font-weight: 400;
  h1 {
    text-transform: none;
    font-size: 36px;
    line-height: 47px;
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
    color: #e9eae9;
    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    display: inline-block;
    border-radius: 10px;
    text-decoration: none;
    text-align: center;
    padding: 11px;
    &:hover {
      opacity: 0.75;
      color: #e9eae9;
    }
  }

  a {
    text-decoration: underline;
    color: #fec004;
    &:hover {
      color: #fec004;
      text-decoration: none;
    }
  }
`;

const Banner = styled.img`
  width: 100%;
  margin-bottom: 23px;
`;
