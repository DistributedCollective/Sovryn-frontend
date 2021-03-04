import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import SalesButton from 'app/components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import { media } from 'styles/media';
import { Checkbox } from '@blueprintjs/core';
import { weiToNumberFormat } from 'utils/display-text/format';
import LogoDark from 'assets/images/sovryn-logo-dark.svg';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';

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
  padding: 0 20px 20px;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-top: 26px;
    margin-bottom: 47px;
  }
  .left-box {
    p {
      font-size: 16px;
      font-weight: 100;
      line-height: 20px;
    }
  }
  .right-box {
    margin: 0 auto;
    max-width: 333px;
    width: 100%;
  }
  ul {
    max-width: 417px;
    margin: 0;
    font-size: 14px;
    line-height: 17px;
    padding: 0 0 0 2rem;
    font-weight: 300;
    li {
      margin-bottom: 1rem;
    }
  }
  label {
    font-size: 14px;
    font-weight: 300;
  }
  .b-group {
    height: 100%;
    width: 100%;
    justify-content: space-around;
    margin-bottom: 1rem;
    button {
      margin: 30px 0;
      padding: 10px 0;
      width: 100%;
    }
    ${media.xl`
      max-width: 527px;
      padding: 0 10px;
      margin-bottom: 1rem;
      button {
        width: auto;
      }
    `}
  }
`;

export default function Screen2() {
  const dispatch = useDispatch();
  const { maxDeposit } = useSelector(selectSalesPage);
  const maxDepositFormatted = Number(weiToNumberFormat(maxDeposit, 3)).toFixed(
    2,
  );
  const [tierLabel, setTierLabel] = useState('');
  const [tierImage, setTierImage] = useState('');
  const [checked, setChecked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    switch (maxDepositFormatted) {
      case '0.03':
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
      case '0.10':
        setTierLabel('Hero');
        setTierImage(sov_2);
        break;
      case '2.00':
        setTierLabel('Superhero');
        setTierImage(sov_3);
        break;
      default:
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
    }
  }, [maxDepositFormatted, setTierLabel, setTierImage]);

  return (
    <StyledContent>
      {!showInfo ? (
        <>
          <p className="content-header">
            Welcome to the SOV* Genesis Pre-order
          </p>
          <div className="row">
            <div className="col-lg-7 col-md-12">
              <div className="b-group left-box">
                <p className="tw-text-center tw-w-full">SOLD OUT!</p>

                <div className="tw-mb-5">
                  <p>
                    To provide the early community with an opportunity to have a
                    stake in Sovryn Bitcocracy, Sovryn has created the SOV
                    Genesis Reservation system.
                  </p>
                  <p>
                    This provides users with the ability to stake funds (based
                    on tier level) and receive cSOV. After SOV TGE occurs, cSOV
                    holders will have the opportunity to either switch cSOV for
                    SOV or redeem their stake.
                  </p>
                </div>
                <SalesButton
                  text={'Continue to sale'}
                  disabled={true}
                  onClick={() => setShowInfo(!showInfo)}
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
            <div className="col-lg-5 col-md-12">
              <div className="right-box tw-relative lg:tw-ml-5">
                <div className="tw-mb-3 tw-mr-2 tw-ml-2 tw-relative tw-inline-block">
                  <div className="image-bordered">
                    <img
                      className="tw-w-full tw-h-full image-responsive"
                      src={tierImage}
                      alt="bg"
                    />
                  </div>
                  <div className="sov-table">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <b>SOV Genesis Pre-Order</b>
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
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="content-header">
            Important Information about the Genesis Pre-Order{''}
            <br />
            Process and Terms.
          </p>
          <div className="d-mtw-flex tw-items-start tw-justify-around tw-mb-4 tw-w-full">
            <ul className="w-30">
              <li>
                Welcome to the SOV pre-order sale. In anticipation of the SOV
                token generation event (TGE), we are offering our early
                community members the opportunity to obtain community SOV
                (cSOV), subject to a bitocracy vote at SOV TGE.
              </li>
              <li>
                Shortly after SOV TGE, which will mark the launch of Sovryn
                Bitocracy v.2, the Sovryn governance members will cast their
                votes approving or rejecting the conversion of cSOV to SOV on a
                1:1 basis. If this vote passes, cSOV holders will have the
                option to convert their cSOV to SOV.
              </li>
              <li>
                SOV received upon conversion from cSOV will be subject to a 10
                month vesting period from the date of the end of SOV public
                sale, whereby 1/10 will be released approximately every 4 weeks
                until all converted SOV are transferable at the end of month 10.
              </li>
            </ul>
            <ul>
              <li>
                Please note that this will not be an automatic process, and will
                require an active opt-in by cSOV holders.
              </li>
              <li>
                cSOV holders that do not wish to convert their cSOV to SOV, will
                have the option to receive a refund of the funds they deposited
                as part of the pre-order sale for a period of up to two months
                after SOV TGE.
              </li>
              <li>
                If a cSOV holder does not actively opt-in to the cSOV to SOV
                conversion, they will automatically receive a refund of their
                pre-sale deposit, two months after the SOV TGE.
              </li>
            </ul>
          </div>
          <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mb-4">
            <Checkbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              label="I have read and understand that I am responsible for my own Sovrynity"
            />
            <div className="tw-mt-4">
              <SalesButton
                text={'I Understand'}
                disabled={!checked}
                onClick={() => dispatch(actions.changeStep(4))}
              />
            </div>
          </div>
        </>
      )}
    </StyledContent>
  );
}
