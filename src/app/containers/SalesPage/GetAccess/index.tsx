import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from '@blueprintjs/core';
import { Asset } from 'types/asset';
import { validateEmail } from 'utils/helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { weiTo2 } from 'utils/blockchain/math-helpers';
import { media } from 'styles/media';
import { actions } from '../slice';
import { selectSalesPage } from '../selectors';
import Loader from '../loader';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { selectTradingPage } from '../../TradingPage/selectors';
import SalesButton from '../../../components/SalesButton';

const StyledContent = styled.div`
  background: var(--sales-background);
  max-width: 1235px;
  min-height: 620px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: 30px 15px;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
  }
  .content-title {
    margin-top: 38px;
    font-size: 20px;
    line-height: 34px;
    font-family: 'Montserrat';
    text-align: center;
    font-weight: 100;
    margin-bottom: 38px;
  }
  a {
    margin-top: 110px;
    color: var(--gold);
    font-weight: normal;
  }
  .text-small {
    font-size: 14px;
    font-family: 'Work Sans';
    line-height: 17px;
    &-bottom {
      font-size: 12px;
    }
  }
  .bp3-slider {
    margin: 0 4.2rem;
    max-width: calc(100% - 170px);
    &-handle {
      background-color: white;
      border-radius: 50%;
      top: 1px;
      .bp3-slider-label {
        left: auto !important;
        right: auto !important;
        top: 23px;
        font-size: 14px;
        margin: 0;
        display: flex;
        width: auto;
        flex-wrap: nowrap;
        justify-content: center;
        margin-left: 0.5rem;
      }
    }
    &-track {
      background: #c1c1c1;
      height: 8px;
    }
    &-label {
      transform: translate(-50%, -3px);
      left: -40px !important;
      font-size: 18px;
      & + .bp3-slider-label {
        right: -135px !important;
        left: auto !important;
      }
    }
    &-progress.bp3-intent-primary {
      background-color: #fec004;
      height: 8px;
    }
  }
  .sliderAmount {
    background: #f4f4f4;
    border-radius: 8px;
    height: 50px;
    width: 100%;
    text-align: center;
    color: black;
    font-size: 18px;
    line-height: 20px;
    font-family: 'Work Sans';
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
    font-weight: 500;
    cursor: text;
    & > *:not(.bp3-divider) {
      margin-right: 0;
    }
    span {
      font-size: 14px;
      font-weight: 100;
      padding-left: 5px;
    }
  }
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 36px;
    min-width: 296px;
    label {
      font-size: 14px;
      margin-bottom: 8px;
      line-height: 17px;
    }
  }
  ${media.xl`
    .sliderAmount {
      width: 289px;
      input {
        width: 289px;
      }
    }
    .bp3-slider {
      max-width: 300px;
    }
  `}
`;

const StyledInput = styled.input.attrs(_ => ({ type: 'text' }))`
  background: #f4f4f4;
  border-radius: 8px;
  height: 50px;
  width: 100%;
  text-align: center;
  color: black;
  font-size: 18px;
  line-height: 20px;
  font-family: 'Work Sans';
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  outline-style: none;
  box-shadow: none;
  &:focus {
    box-shadow: none;
    border-radius: 8px;
  }
  ${media.xl`
    width: 289px;
  `}
`;

const StyledInputNumber = styled.input.attrs(_ => ({ type: 'number' }))`
  background: #f4f4f4;
  border-radius: 8px;
  height: 50px;
  width: 100%;
  text-align: center;
  color: black;
  font-size: 14px;
  font-family: 'Work Sans';
  font-weight: 100;
  ${media.xl`
    width: 289px;
  `}
`;

interface Props {
  hideBackButton?: boolean;
}

export default function GetAccess(props: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [enterCount, setEnterCount] = useState(false);
  const emailValid = validateEmail(email);
  const valid = !!email && emailValid;
  const [amount, setAmount] = useState<number>(0);
  const { tradingPair } = useSelector(selectTradingPage);
  const { requestAccessLoading, requestAccessError } = useSelector(
    selectSalesPage,
  );

  const pair = TradingPairDictionary.get(tradingPair);
  const { value: price } = useCachedAssetPrice(pair.getAsset(), Asset.DOC);
  const usdPrice = weiTo2(Number(price) * amount);

  const maxAmount = 100;
  const searchInput = useRef(null as any);

  useEffect(() => {
    if (enterCount) {
      searchInput.current.focus();
    }
  }, [enterCount]);

  const handleSubmit = () => {
    dispatch(
      actions.requestAccess({
        email,
        discord: username,
        amount,
      }),
    );
  };

  const getChangeHandler = () => {
    return (value: number) => {
      if (value > maxAmount) {
        setAmount(maxAmount);
      } else {
        setAmount(value);
      }
    };
  };
  const setInputAmount = (val: number) => {
    if (val > maxAmount) {
      setAmount(maxAmount);
    } else {
      setAmount(val);
    }
  };

  const renderBTCLabel = val => {
    return `${val} BTC`;
  };

  return (
    <>
      {requestAccessLoading ? (
        <Loader
          content={
            <p className="content-header">
              We are currently processing your request
            </p>
          }
        />
      ) : (
        <>
          <hr style={{ borderColor: '#d9d9d9' }} />
          <StyledContent>
            <p className="content-header">Genesis Pre-Order has sold out!</p>
            <p className="text-center mb-5">
              Register for whitelist access to the upcoming SOV token public
              sale
            </p>

            <div className="row mb-4 mt-5">
              <div className="col-lg-6 col-md-12 d-lg-flex flex-lg-column align-items-center">
                <div className="pl-lg-1">
                  <div className="form-group">
                    <label htmlFor="username">Enter pseudonym</label>
                    <StyledInput
                      name="username"
                      id="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Enter email</label>
                    <StyledInput
                      name="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    {!!email && !emailValid && (
                      <small className="text-muted">
                        Enter valid email address.
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 pr-lg-5">
                <div>
                  <div className="form-group">
                    <label htmlFor="amount">
                      Please enter amount you wish to purchase (optional)
                    </label>
                    {enterCount ? (
                      <StyledInputNumber
                        ref={searchInput}
                        value={amount}
                        id="amount"
                        pattern="^-?[0-9]{0,2}\d*\.?\d*$"
                        max={maxAmount}
                        placeholder="Enter a number..."
                        min={0}
                        onBlur={() => setEnterCount(false)}
                        className="sliderAmount"
                        onChange={e => setInputAmount(Number(e.target.value))}
                      />
                    ) : (
                      <div
                        className="sliderAmount"
                        onClick={() => {
                          setEnterCount(true);
                        }}
                      >
                        {amount} <span>≈ ${usdPrice}</span>
                      </div>
                    )}
                    <Slider
                      min={0}
                      max={maxAmount}
                      stepSize={0.5}
                      labelRenderer={renderBTCLabel}
                      labelStepSize={maxAmount}
                      value={amount}
                      onRelease={() => setEnterCount(false)}
                      onChange={getChangeHandler()}
                    />
                    <p className="text-small mt-3">
                      Sharing with us your intended contribution is optional. It
                      does not constrain you to actually participate but it
                      helps us to better understand our community.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <p className="text-center text-small-bottom mt-0 mb-3">
                  By joining the waitlist you agree to receive the latest news
                  about the SOV ecosystem
                </p>

                {requestAccessError && (
                  <div className="text-danger">{requestAccessError}</div>
                )}
                <SalesButton
                  text={'Register for whitelist'}
                  onClick={handleSubmit}
                  loading={requestAccessLoading}
                  disabled={requestAccessLoading || !valid}
                />
              </div>
            </div>
          </StyledContent>
        </>
      )}
    </>
  );
}
