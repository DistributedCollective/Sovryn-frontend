import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import SalesButton from 'app/components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import { media } from 'styles/media';
import { weiToNumberFormat } from 'utils/display-text/format';
import { trimZero } from 'utils/blockchain/math-helpers';
import LogoDark from 'assets/images/sovryn-logo-dark.svg';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';

const StyledContent = styled.div`
  background: var(--sales-background);
  max-width: 1235px;
  min-height: 620px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-top: 26px;
    margin-bottom: 54px;
  }
  .left-box {
    margin-left: 0px;
    max-width: 333px;
    width: 100%;
  }
  .b-group {
    height: 100%;
    width: 100%;
    justify-content: space-around;
    margin-bottom: 1rem;
    button {
      margin: 15px 0;
      padding: 10px 0;
    }
    ${media.xl`
      max-width: 280px;
      padding: 0 40px;
      margin-bottom: 1rem;
    `}
  }
`;

export default function Screen2() {
  const dispatch = useDispatch();
  const { maxDeposit } = useSelector(selectSalesPage);
  const maxDepositFormatted = trimZero(weiToNumberFormat(maxDeposit, 8));
  const [tierLabel, setTierLabel] = useState('');
  const [tierImage, setTierImage] = useState('');

  useEffect(() => {
    switch (maxDepositFormatted) {
      case '0.03':
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
      case '0.1':
        setTierLabel('Hero');
        setTierImage(sov_2);
        break;
      case '2':
        setTierLabel('Superhero');
        setTierImage(sov_3);
        break;
      default:
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
    }
  }, [maxDepositFormatted, setTierLabel, setTierImage]);

  const { value: isStopSale } = useCacheCallWithValue(
    'CrowdSale',
    'isStopSale',
    false,
  );

  const { value: end } = useCacheCallWithValue('CrowdSale', 'end', '0');

  const { value: availableTokens } = useCacheCallWithValue(
    'CrowdSale',
    'availableTokens',
    '0',
  );

  const [isSaleOpen, setIsSaleOpen] = useState(false);

  useEffect(() => {
    setIsSaleOpen(
      !isStopSale &&
        Number(end) > 0 &&
        Date.now() < Number(end) * 10e3 &&
        Number(availableTokens) > 0,
    );
  }, [isStopSale, end, availableTokens]);

  return (
    <StyledContent>
      <p className="content-header">Welcome to the SOV* Genesis Sale</p>
      <div className="d-flex flex-column align-items-center flex-lg-row px-3 pb-5">
        <div className="left-box position-relative mr-lg-5">
          <div className="mb-3 mr-2 ml-2 position-relative d-inline-block">
            <div className="image-bordered">
              <img
                className="w-100 h-100 image-responsive"
                src={tierImage}
                alt="bg"
              />
            </div>
            <div className="sov-table">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <b>SOV Genesis Sale</b>
                    </td>
                    <td rowSpan={2}>
                      <img src={LogoDark} alt="logo" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Purchase Limit: {maxDepositFormatted} BTC</b>
                    </td>
                  </tr>
                  <tr>
                    <td>{tierLabel} Tier</td>
                    <td>
                      <div>SOV-OG</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-around b-group">
          <SalesButton
            text={'Continue to sale'}
            disabled={!isSaleOpen}
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
