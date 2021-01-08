import React from 'react';
import styled from 'styled-components';
import SalesButton from 'app/components/SalesButton';
import { useDispatch } from 'react-redux';
import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import { useSelector } from 'react-redux';
import { fromWei, trimZero } from 'utils/blockchain/math-helpers';

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
  .content {
    width: 650px;
    font-weight: 100;
  }
  .b-group {
    height: 240px;
    justify-content: space-around;
  }
`;

export default function Screen2() {
  const dispatch = useDispatch();
  const { maxDeposit } = useSelector(selectSalesPage);
  return (
    <StyledContent>
      <p className="content-header">Welcome to the SOV* Genesis Sale</p>
      <p className="text-center content">
        To thank you for supporting SOVRYN by being here from the start
        <br /> we have granted you access to <br />
        purchase up to {trimZero(fromWei(maxDeposit))} BTC worth of SOV
      </p>
      <div className="d-flex flex-column justify-content-around b-group">
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
    </StyledContent>
  );
}
