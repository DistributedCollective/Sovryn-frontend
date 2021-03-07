import React from 'react';
import styled from 'styled-components/macro';
import Sovmodel from 'assets/images/sovmodel.svg';
import Sovbitocracy from 'assets/images/sovbitocracy.svg';
import { media } from '../../../styles/media';

const StyledContainer = styled.section`
  background: #101010;
  padding: 40px;
  border-radius: 40px;
  min-height: 530px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 40px 0;
  color: #f4f4f4;
  font-weight: 100;
  font-size: 16px;
  @media screen and (min-width: 1280px) {
    padding: 40px 120px;
  }
  p {
    line-height: 21px;
    letter-spacing: 0.2px;
  }
  .header,
  h2 {
    font-weight: 700;
    font-size: 24px;
    text-transform: none;
    margin-bottom: 49px;
    ${media.lg`
      font-size: 38px;
    `}
  }
  .title,
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: white;
    text-transform: none;
    margin-bottom: 6px;
  }
  .sub-title,
  h4 {
    font-size: 16px;
    font-weight: 400;
    color: white;
    text-transform: none;
    margin-bottom: 10px;
  }
  .content {
    display: flex;
    margin-bottom: 15px;
    .bullet {
      color: #f4f4f4;
      margin-right: 15px;
    }
    .text {
      color: #d9d9d9;
    }
  }
  .col {
    @media (max-width: 767px) {
      flex-basis: 100%;
    }
  }
  .px-big {
    padding-right: 3rem;
    padding-left: 1.6rem;
    @media (max-width: 767px) {
      padding: 0 15px;
    }
    &:first-of-type {
      padding-left: 1rem;
      @media (max-width: 767px) {
        padding: 0 15px;
      }
    }
    &:last-of-type {
      padding-right: 0;
      padding-left: 4.5rem;
      @media (max-width: 767px) {
        padding: 0 15px;
      }
    }
    &.column-left {
      max-width: 420px;
      padding: 0;
      @media (max-width: 767px) {
        padding: 0 15px;
        width: 100%;
        max-width: 100%;
      }
    }
    &.column-center {
      padding: 0;
      @media (max-width: 767px) {
        padding: 0 15px;
        width: 100%;
        max-width: 100%;
      }
    }
    &.column-right {
      padding: 0 0 0 10px;
      max-width: 420px;
      margin-top: 1.4rem;
      @media (max-width: 767px) {
        padding: 0 15px;
        width: 100%;
        max-width: 100%;
        margin-top: 0;
      }
    }
  }
  .allocation-image {
    width: 630px;
  }
`;

export function AboutSOV() {
  return (
    <StyledContainer>
      <h2 className="header">Use and Value Accrual of SOV</h2>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12">
        <section className="md:tw-col-span-4 px-big">
          <h3 className="title">Bitocracy:</h3>
          <p>
            SOV staked in the Bitocracy system earns voting rights weighted by
            the length of staking time. Additionally, system revenues are
            distributed on an on-going basis to those actively participating in
            governance, in relation to their voting weight. This combination of
            voting power and revenue yield, incentivizes long-term commitment
            and thinking. SOV stakeholders can choose the length of time in
            which they intend to stake their tokens (up to 36 months). They may
            also delegate their vote to other participants to incentivize
            experts to specialise in Sovryn Bitocracy.
          </p>
        </section>
        <section className="md:tw-col-span-4 px-big">
          <h3 className="title">Risk Mitigation: </h3>
          <p>
            SOV provides risk coverage for the protocol by acting as a pool of
            staked value that can be burned, redistributed or inflated to
            prevent and offset losses that might occur. For example, staked SOV
            can be used to create trustless BTC multisig pools (eg. for use in
            the bridge), such that theft of funds is avoided. Additionally,
            trustless BTC multisig pools (eg. for use in the bridge), such that
            theft of funds is avoided. Additionally, stakeholders who have
            staked in the Bitocracy system are incentivised to place a continued
            emphasis and investment in protocol security, lest users lose funds
            and SOV value is transferred from stakers to users to offset those
            losses.
          </p>
        </section>
        <section className="md:tw-col-span-4 px-big">
          <h3 className="title">Fee Collection:</h3>
          <p>
            The Sovryn DeFi platform is a revenue-generating business upheld by
            its governing SOV stakeholders. This includes fees from swapping,
            lending, borrowing, leveraging, and all future fees collected by new
            additional features introduced by Sovryn.
          </p>
        </section>
      </div>
    </StyledContainer>
  );
}

export function SOVModel() {
  return (
    <StyledContainer>
      <h2 className="header">SOV Allocation Model</h2>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12">
        <section className="tw-col-span column-left px-big">
          <section className="lg:tw-mb-5">
            <h3 className="title">Early Funders: 16,920,000 SOV</h3>
            <h4>10-24 month vesting</h4>
            <p>
              The early funders of Sovryn believe in the future success of
              Sovryn as a revenue-generating business as well as the
              effectiveness of Sovryn’s Bitocracy that supports the
              decentralized business model. These early funders have acquired a
              long-term stake in SOV with a view to participation in the
              Bitcoracy.
            </p>
          </section>
          <section className="lg:tw-mb-5">
            <h3 className="title">Founders Fund: 25,000,000 SOV</h3>
            <h4>3 year vesting with a 6 month cliff</h4>
            <p>
              The early funders of Sovryn believe in the future success of
              Sovryn as a revenue-generating business as well as the
              effectiveness of Sovryn’s Bitocracy that supports the
              decentralized business model. These early funders have acquired a
              long-term stake in SOV with a view to participation in the
              Bitcoracy.
            </p>
          </section>
          <section>
            <h3 className="title">Adoption Fund: 38,080,000 SOV</h3>
            <p>
              The heart of Sovryn is in the users who employ the product for the
              utilization of their funds. SOV will be distributed to users and
              contributors of the system via rebates, referral fees and
              liquidity mining. Tokens distributed via liquidity mining will be
              the incentivization vehicle for bringing new users and funds to
              Sovryn across multiple DeFi ecosystems. With the release of new
              products, the adoption can be used to reward the first users and
              testers to ensure their optimization and success.
            </p>
          </section>
        </section>
        <div className="tw-col-span column-center px-big tw-flex tw-mt-6 tw-mb-6 lg:tw-mb-0">
          <div className="tw-pb-4 tw-mb-12 tw-mx-auto">
            <img src={Sovmodel} alt="" className="tw-w-full tw-h-full" />
          </div>
        </div>

        <div className="tw-col-span column-right px-big">
          <section className="lg:tw-mb-5">
            <h3 className="title">Development Fund: 10,000,000 SOV</h3>
            <p>
              The development pool will serve as a treasury for
              development-related grants and bounties for the construction of
              new features and rewarding new contributing builders. This will
              support on-going security and maintenance, as well as R&D.
            </p>
          </section>
          <section className="lg:tw-mb-5">
            <h3 className="title">Ecosystem Fund: 5,000,000 SOV</h3>
            <p>
              These tokens have been dedicated towards ecosystem initiatives,
              including ecosystem-oriented bounty programs to engage the
              community, or to execute partnerships with other DeFi on Bitcoin
              organizations. With new product releases comes the need for
              incentivizing the onboarding of new users to Sovryn.
            </p>
          </section>
          <section className="lg:tw-pt-3">
            <h3 className="title">Programmatic Sale: 5,000,000 SOV</h3>
            <p>
              To further distribute SOV tokens and enfranchise interested users,
              a programmatic sale will be held by the protocol. This will
              provide opportunity for users to procure SOV tokens and
              participate as Sovryn voters & stakeholders.
            </p>
          </section>
        </div>
      </div>
    </StyledContainer>
  );
}
export function SOVGovernance() {
  return (
    <StyledContainer>
      <h2 className="header">SOV Bitocracy (Governance)</h2>
      <div className="tw-grid tw-gap-8 tw--mx-4 tw-grid-cols-12">
        <section className="tw-col-span column-left lg:tw-p-0">
          <h3 className="title">Bitocracy:</h3>
          <p>
            The SOV Bitocracy is a distributed, pseudonymous governing body of
            stakeholders in the future of the Sovryn protocol and business
            <br />
            <br />
            SOV token holders can make executable proposals if they possess
            enough voting power, vote on proposals during a predefined voting
            period and in the end evaluate the outcome. If successful, the
            proposal will be scheduled on the timelock contract. Only after
            sufficient time has passed can it be executed. A minimum voting
            power of 1% of SOV (1,000,000) is required for making a proposal as
            well as a minimum quorum.
            <br />
            <br />
            In addition, SOV token holders can aggregate their governing power
            to a specific stakeholder (without transferring their SOV tokens)
            through delegation
          </p>
        </section>
        <div className="md:tw-col-span-5 column-center tw-flex tw-mb-6 lg:tw-mb-0">
          <div className="lg:tw-p-0 tw-mx-auto">
            <img
              src={Sovbitocracy}
              alt=""
              className="tw-w-full tw-h-full lg:tw-ml-12"
            />
          </div>
        </div>
        <section className="tw-col-span column-right lg:tw-pl-12">
          <h3 className="title">Bitocracy Voting</h3>
          <div className="content">
            <span className="bullet">01.</span>
            <span className="text">User requests to makes a code proposal</span>
          </div>
          <div className="content">
            <span className="bullet">02.</span>
            <span className="text">
              Governance contract checks the Staking contract to determine if
              the user has enough voting power
            </span>
          </div>
          <div className="content">
            <span className="bullet">03.</span>
            <span className="text">
              If the user has the required amount of voting power then the
              proposal is accepted by the Governance contract and all users with
              voting power are able to vote.
            </span>
          </div>
          <div className="content">
            <span className="bullet">04.</span>
            <span className="text">
              Once the voting period is over and the proposal has been voted on,
              it is directly scheduled for execution and sits in the Timelock
              contract. The timelock setting decides on the waiting time.{' '}
            </span>
          </div>
          <div className="content">
            <span className="bullet">05.</span>
            <span className="text">
              At the allocated time the proposal executes on the SOVRYN protocol
            </span>
          </div>
        </section>
      </div>
    </StyledContainer>
  );
}
