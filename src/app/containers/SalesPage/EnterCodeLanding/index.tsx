import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import SalesButton from '../../../components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slice';
import { useAccount } from 'app/hooks/useAccount';
import { selectSalesPage } from '../selectors';
import Screen5 from '../screen5';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { contractReader } from '../../../../utils/sovryn/contract-reader';

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
  padding: 47px 15px;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-bottom: 80px;
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
`;

const StyledInput = styled.input.attrs(_ => ({ type: 'text' }))`
  background: #f4f4f4;
  border-radius: 8px;
  height: 40px;
  width: 289px;
  text-align: center;
  color: black;
  margin: 25px 0 30px;
  font-size: 14px;
  font-family: 'Work Sans';
  font-weight: 100;
`;

interface Props {
  hideBackButton?: boolean;
}

export default function EnterCodeLanding(props: Props) {
  const address = useAccount();
  const [code, setCode] = useState('');

  const dispatch = useDispatch();

  const { upgradeLoading, codeError, codeTx } = useSelector(selectSalesPage);

  const handleSubmit = () => {
    dispatch(actions.useCode({ address, code }));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.useCodeCleanup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (codeTx) {
      const getLimit = async () =>
        await contractReader.call('CrowdSale', 'getMaxPurchase', [address]);
      getLimit().then(limit =>
        dispatch(actions.updateMaxDeposit(limit as any)),
      );
    }
  }, [address, codeTx, dispatch]);

  if (codeTx) {
    return (
      <Screen5
        content={
          <p className="content-header">
            Your code was accepted and processed.
            <br />
            Tx: <LinkToExplorer txHash={codeTx} />
          </p>
        }
      />
    );
  }

  return (
    <StyledContent>
      <p className="content-header">Welcome to the SOV* Genesis Pre-Order</p>
      <div className="tw-flex tw-flex-row tw-justify-center">
        <div style={{ width: 417 }} className="tw-mr-12">
          <p>
            The Genesis Pre-Order is whitelisted for our early adopters. All
            users of the SOVRYN system before 8th January 2021 have been
            airdropped their exclusive access NFT’s.
          </p>
          <p>
            If you believe that you are missing your NFT, please reach out via{' '}
            <a href="mailto:community@sovryn.app?subject=Missing%20NFT">
              email here
            </a>
            .
          </p>
          <p>
            If you didn’t make the cutoff all is not lost! The SOVRYN public
            sale will be announced in the next couple of weeks. In the meantime
            you can{' '}
            <a
              href="https://sovryn.app/blog/the-sovryn-genesis-sale-extending-the-bitocracy-to-early-sovryn-users.html"
              target="_blank"
              rel="noreferrer noopener"
            >
              learn more about SOV token here
            </a>
            .
          </p>
        </div>
        <div
          style={{ width: 300 }}
          className="tw-flex flex-fill tw-flex-col tw-items-center tw-justify-center tw-ml-12"
        >
          <p className="content-title tw-my-0">Enter access code to continue</p>
          {codeError && (
            <div className="tw-text-danger tw-text-center">{codeError}</div>
          )}
          {upgradeLoading && (
            <div className="tw-text-info tw-text-center">
              Loading. This can take couple of minutes.
            </div>
          )}
          <StyledInput
            placeholder="Enter code"
            name="code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <SalesButton
            text={'Submit Code'}
            onClick={handleSubmit}
            loading={upgradeLoading}
            disabled={upgradeLoading || code.length < 6}
          />
        </div>
      </div>
    </StyledContent>
  );
}
