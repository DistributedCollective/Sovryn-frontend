/**
 *
 * WalletPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import GovernanceSVG from './governance.svg';
import Sovmodel from './sovmodel.svg';
import styled from 'styled-components';
import { useIsConnected } from '../../hooks/useAccount';

import PageHeader from '../../components/PageHeader';
import SalesContent from '../../components/SalesContent';

import SalesButton from '../../components/SalesButton';

import { TutorialSOVModal } from '../TutorialSOVModal/Loadable';
import { useSelector, useDispatch } from 'react-redux';
import { SHOW_MODAL } from 'utils/classifiers';
import { actions } from 'app/containers/TutorialDialogModal/slice';
import { reactLocalStorage } from 'reactjs-localstorage';

const StyledContent = styled.div`
  height: 600px;
  background: rgba(0, 0, 0, 0.27);
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .content-header {
    font-size: 28px;
    text-align: center;
  }
  a {
    margin-top: 110px;
    color: var(--gold);
    font-weight: normal;
  }
`;

const StyledInput = styled.input.attrs(_ => ({ type: 'text' }))`
  border: 1px solid #707070;
  background: #f4f4f4;
  border-radius: 8px;
  height: 40px;
  width: 289px;
  text-align: center;
  color: black;
  margin: 25px 0;
`;

const StyledContainer = styled.div`
  background: #141414;
  padding: 30px 100px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 40px 0;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d9d9d9;
  padding-top: 20px;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 20px;
  max-width: 1520px;
  margin-left: auto;
  margin-right: auto;
  p:last-child {
    font-size: 20px;
    margin-bottom: 0;
  }
`;

function AboutSOV() {
  return (
    <StyledContainer>
      <p className="font-size-xl">About SOV Token</p>
      <div className="row">
        {[1, 2, 3].map(i => (
          <div className="col-md-4" key={i}>
            <p>
              SOV is issued off the rootstock (RSK) smart contract platform,
              which operates on a Bitcoin sidechain. The token itself does not
              grant governance rights, which departs from most DeFi protocols of
              today. Instead, it gives the option for the token holder to stake,
              which does come with governance benefits. The token itself is not
              like an altcoin. It’s considered an equity asset, or a
              decentralized share. Users never hold the token and SOV has no
              utility. Instead it enables the lending of Bitcoin and other
              tokenized assets. SOV distributions can go out to participants for
              fee rebates, liquidity mining incentives, or referral programs. By
              incentivizing in these ways, SOV allows each staker to hold
              decentralized equity in the Sovryn Bitocracy.
            </p>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
}
function SOVModel() {
  return (
    <StyledContainer>
      <p className="font-size-xl">SOV Allocation Model</p>
      <div className="row">
        <div className="col-md-4">
          <p>
            SOV is issued off the rootstock (RSK) smart contract platform, which
            operates on a Bitcoin sidechain. The token itself does not grant
            governance rights, which departs from most DeFi protocols of today.
            Instead, it gives the option for the token holder to stake, which
            does come with governance benefits. The token itself is not like an
            altcoin. It’s considered an equity asset, or a decentralized share.
            Users never hold the token and SOV has no utility. Instead it
            enables the lending of Bitcoin and other tokenized assets. SOV
            distributions can go out to participants for fee rebates, liquidity
            mining incentives, or referral programs. By incentivizing in these
            ways, SOV allows each staker to hold decentralized equity in the
            Sovryn Bitocracy.
          </p>
        </div>
        <div className="col-md-4 d-flex">
          <img src={Sovmodel} alt="" className="w-100 h-100" />
        </div>

        <div className="col-md-4">
          <p>
            SOV is issued off the rootstock (RSK) smart contract platform, which
            operates on a Bitcoin sidechain. The token itself does not grant
            governance rights, which departs from most DeFi protocols of today.
            Instead, it gives the option for the token holder to stake, which
            does come with governance benefits. The token itself is not like an
            altcoin. It’s considered an equity asset, or a decentralized share.
            Users never hold the token and SOV has no utility. Instead it
            enables the lending of Bitcoin and other tokenized assets. SOV
            distributions can go out to participants for fee rebates, liquidity
            mining incentives, or referral programs. By incentivizing in these
            ways, SOV allows each staker to hold decentralized equity in the
            Sovryn Bitocracy.
          </p>
        </div>
      </div>
    </StyledContainer>
  );
}
function SOVGovernance() {
  return (
    <StyledContainer>
      <p className="font-size-xl">SOV Governance (Bitocracy)</p>
      <div className="row">
        <div className="col-md-4 d-flex">
          <img src={GovernanceSVG} alt="" className="w-100 h-100" />
        </div>
        <div className="col-md-4">
          <p>
            SOV is issued off the rootstock (RSK) smart contract platform, which
            operates on a Bitcoin sidechain. The token itself does not grant
            governance rights, which departs from most DeFi protocols of today.
            Instead, it gives the option for the token holder to stake, which
            does come with governance benefits. The token itself is not like an
            altcoin. It’s considered an equity asset, or a decentralized share.
            Users never hold the token and SOV has no utility. Instead it
            enables the lending of Bitcoin and other tokenized assets. SOV
            distributions can go out to participants for fee rebates, liquidity
            mining incentives, or referral programs. By incentivizing in these
            ways, SOV allows each staker to hold decentralized equity in the
            Sovryn Bitocracy.
          </p>
        </div>
        <div className="col-md-4">
          <p>
            SOV is issued off the rootstock (RSK) smart contract platform, which
            operates on a Bitcoin sidechain. The token itself does not grant
            governance rights, which departs from most DeFi protocols of today.
            Instead, it gives the option for the token holder to stake, which
            does come with governance benefits. The token itself is not like an
            altcoin. It’s considered an equity asset, or a decentralized share.
            Users never hold the token and SOV has no utility. Instead it
            enables the lending of Bitcoin and other tokenized assets. SOV
            distributions can go out to participants for fee rebates, liquidity
            mining incentives, or referral programs. By incentivizing in these
            ways, SOV allows each staker to hold decentralized equity in the
            Sovryn Bitocracy.
          </p>
        </div>
      </div>
    </StyledContainer>
  );
}
function CodeConfirmation({ handleSubmit }) {
  const [hasCode, setHasCode] = useState(true);

  return hasCode ? (
    <StyledContent>
      <p className="content-header">
        Please enter your code to gain access
        <br /> to the SOV* Genesis Sale
      </p>
      <StyledInput placeholder="Enter code" name="code" />

      <SalesButton text={'Submit Code'} onClick={() => handleSubmit()} />
      <a href="#" onClick={() => setHasCode(false)}>
        Don’t have a code? Click here to get one!
      </a>
    </StyledContent>
  ) : (
    <StyledContent>
      <p className="content-header">
        Please enter your email address
        <br />
        to register for an access code{' '}
      </p>
      <StyledInput placeholder="Enter email address" name="code" />
      <SalesButton text={'Register'} onClick={() => {}} />
    </StyledContent>
  );
}

export function SalesPage() {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [isOwned, setIsOwned] = useState(false);
  const handleSubmit = () => {
    setIsOwned(true);
  };
  const handleEngage = () => {
    dispatch(actions.showModal(SHOW_MODAL))
    reactLocalStorage.set('closedRskTutorial', 'false');
  }
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>{t(translations.salesPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.salesPage.meta.description)}
        />
      </Helmet>

      <TutorialSOVModal />
      <Header />
      <div className="container" style={{ maxWidth: '1700px' }}>
        <PageHeader />
        <InfoBar>
          <div>
            <p>Total Supply:</p>
            <p>21,000,000 SOV</p>
          </div>
          <div>
            <p>Sales Allocation:</p>
            <p>1,333,333 SOV</p>
          </div>
          <div>
            <p>Allocation Remaining:</p>
            <p>25% ≈ 333,333 SOV*</p>
          </div>
          <div>
            <p>Price:</p>
            <p>$0.75/SOV</p>
          </div>
          <div>
            <p>Vesting:</p>
            <p>6 Months</p>
          </div>
          <div>
            <p>Accepted currencies:</p>
            <p>BTC, RBTC</p>
          </div>
          <div>
            <p>Token Sale End Time :</p>
            <p>16.00 CET, 8th Jan</p>
          </div>
        </InfoBar>
        {!isOwned ? (
          !isConnected ? (
            <StyledContent>
              <p className="content-header">
                Engage your wallet to participate in the
                <br />
                SOV Genesis Sale
              </p>
              <SalesButton
                text={t(translations.wallet.connect_btn)}
                onClick={handleEngage}
              />
            </StyledContent>
          ) : (
            <CodeConfirmation handleSubmit={handleSubmit} />
          )
        ) : (
          <SalesContent />
        )}
        <AboutSOV />
        <SOVModel />
        <SOVGovernance />
        <div className="footer d-flex justify-content-center mb-5">
          <SalesButton text="Read Our Whitepaper" onClick={() => {}} />
        </div>
      </div>
    </>
  );
}
