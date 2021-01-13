import React from 'react';
import styled from 'styled-components/macro';
import SalesButton from 'app/components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import { weiToNumberFormat } from '../../../../utils/display-text/format';
import { trimZero } from 'utils/blockchain/math-helpers';
import NFT1 from 'assets/images/NFT1.png';
import LogoDark from 'assets/images/sovryn-logo-dark.svg';

const StyledContent = styled.div`
  background: var(--sales-background);
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 45px;
  }
  .b-group {
    height: 240px;
    justify-content: space-around;
  }
  .left-box > img {
    padding: 10px;
    background: white;
    border-radius: 20px;
  }
  .grid-container {
    position: absolute;
    bottom: 40px;
    left: 27px;
    width: 280px;
    display: grid;
    color: #707070;
    grid-template-columns: 220px 60px;
    grid-template-rows: 30px 30px 30px;
    grid-template-areas:
      'title logo'
      'limit logo'
      'tier gen';
    background: white;
    border-bottom: 1px solid #707070;
    border-left: 1px solid #707070;
    & > div,
    & > span {
      border-top: 1px solid #707070;
      border-right: 1px solid #707070;
      display: flex;
      align-items: center;
      padding-left: 10px;
    }
    .title {
      grid-area: title;
      font-weight: 600;
      font-size: 16px;
    }
    .logo {
      grid-area: logo;
      padding: 0;
      justify-content: center;
    }
    .limit {
      grid-area: limit;
      font-weight: 400;
      font-size: 14px;
    }
    .tier {
      grid-area: tier;
      font-weight: 300;
      font-size: 12px;
    }
    .gen {
      grid-area: gen;
      font-size: 9px;
      font-weight: 400;
    }
  }
`;

export default function Screen2() {
  const dispatch = useDispatch();
  const { maxDeposit } = useSelector(selectSalesPage);
  return (
    <StyledContent>
      <p className="content-header">Welcome to the SOV* Genesis Sale</p>
      <div className="d-flex flex-column flex-lg-row px-3 pb-5">
        <div className="left-box position-relative">
          <div className="grid-container">
            <span className="title">SOV Genesis Sale</span>
            <span className="limit">
              Purchase Limit: {trimZero(weiToNumberFormat(maxDeposit, 8))} BTC
            </span>
            <div className="logo mw-100">
              <img src={LogoDark} alt="logo" className="mw-100" />
            </div>
            <span className="tier">Community Tier</span>
            <span className="gen">SOV-GEN</span>
          </div>
          <img src={NFT1} alt="NFT1" />
        </div>
        <div className="d-flex flex-column justify-content-around b-group px-lg-5">
          <SalesButton
            text={'Continue to sale'}
            onClick={() => dispatch(actions.changeStep(4))}
          />

          <SalesButton
            text={'Input upgrade code'}
            onClick={() => dispatch(actions.changeStep(3))}
          />

          <SalesButton
            text={'Request higher limit'}
            onClick={() => dispatch(actions.changeStep(6))}
          />
        </div>
      </div>
    </StyledContent>
  );
}
