import React from 'react';
import styled from 'styled-components';
import GovernanceSVG from 'assets/images/governance.svg';
import Sovmodel from 'assets/images/sovmodel.svg';

const StyledContainer = styled.div`
  background: #141414;
  padding: 30px 100px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 40px 0;
  color: #f4f4f4;
  p {
    font-weight: 100;
  }
  .header {
    font-weight: 300;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    color: white;
  }
`;

export function AboutSOV() {
  return (
    <StyledContainer>
      <p className="font-size-xl header">Use and Value Accrual of SOV</p>
      <div className="row">
        <div className="col-md-4">
          <p className="title">Bitocracy:</p>
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
        </div>
        <div className="col-md-4">
          <p className="title">Risk Mitigation: </p>
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
        </div>
        <div className="col-md-4">
          <p className="title">Fee Collection:</p>
          <p>
            The Sovryn DeFi platform is a revenue-generating business upheld by
            its governing SOV stakeholders. This includes fees from swapping,
            lending, borrowing, leveraging, and all future fees collected by new
            additional features introduced by Sovryn.
          </p>
        </div>
      </div>
    </StyledContainer>
  );
}
export function SOVModel() {
  return (
    <StyledContainer>
      <p className="font-size-xl header">SOV Allocation Model</p>
      <div className="row">
        <div className="col-md-4">
          <p className="title">
            Early Funders: 16,920,000 SOV 10-24 month vesting
          </p>
          <p>
            The early funders of Sovryn believe in the future success of Sovryn
            as a revenue-generating business as well as the effectiveness of
            Sovryn’s Bitocracy that supports the decentralized business model.
            These early funders have acquired a long-term stake in SOV with a
            view to participation in the Bitcoracy.
          </p>
          <p className="title">
            Founders Fund: 25,000,000 SOV 3 year vesting with a 6 month cliff
          </p>
          <p>
            The early funders of Sovryn believe in the future success of Sovryn
            as a revenue-generating business as well as the effectiveness of
            Sovryn’s Bitocracy that supports the decentralized business model.
            These early funders have acquired a long-term stake in SOV with a
            view to participation in the Bitcoracy.
          </p>
        </div>
        <div className="col-md-4 d-flex">
          <img src={Sovmodel} alt="" className="w-100 h-100" />
        </div>

        <div className="col-md-4">
          <p className="title">Development Fund: 10,000,000 SOV</p>
          <p>
            The development pool will serve as a treasury for
            development-related grants and bounties for the construction of new
            features and rewarding new contributing builders. This will support
            on-going security and maintenance, as well as R&D.
          </p>
          <p className="title">Ecosystem Fund: 5,000,000 SOV</p>
          <p>
            These tokens have been dedicated towards ecosystem initiatives,
            including ecosystem-oriented bounty programs to engage the
            community, or to execute partnerships with other DeFi on Bitcoin
            organizations. With new product releases comes the need for
            incentivizing the onboarding of new users to Sovryn.
          </p>
          <p className="title">Programmatic Sale: 5,000,000 SOV</p>
          <p>
            To further distribute SOV tokens and enfranchise interested users, a
            programmatic sale will be held by the protocol. This will provide
            opportunity for users to procure SOV tokens and participate as
            Sovryn voters & stakeholders.
          </p>
        </div>
      </div>
    </StyledContainer>
  );
}
export function SOVGovernance() {
  return (
    <StyledContainer>
      <p className="font-size-xl header">SOV Bitocracy (Governance)</p>
      <div className="row">
        <div className="col-md-4 d-flex">
          {/* <img src={GovernanceSVG} alt="" className="w-100 h-100" /> */}
        </div>
        <div className="col-md-4">
          <p className="title">Bitocracy:</p>
          <p>
            The SOV Bitocracy is a distributed, pseudonymous governing body of
            stakeholders in the future of the Sovryn protocol and business SOV
            token holders can make executable proposals if they possess enough
            voting power, vote on proposals during a predefined voting period
            and in the end evaluate the outcome. If successful, the proposal
            will be scheduled on the timelock contract. Only after sufficient
            time has passed can it be executed. A minimum voting power of 1% of
            SOV (1,000,000) is required for making a proposal as well as a
            minimum quorum. In addition, SOV token holders can aggregate their
            governing power to a specific stakeholder (without transferring
            their SOV tokens) through delegation
          </p>
        </div>
        <div className="col-md-4"></div>
      </div>
    </StyledContainer>
  );
}
