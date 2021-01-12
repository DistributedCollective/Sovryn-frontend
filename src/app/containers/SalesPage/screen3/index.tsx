import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import SalesButton from '../../../components/SalesButton';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slice';
import { useAccount } from 'app/hooks/useAccount';
import BackButton from '../BackButton';
import { selectSalesPage } from '../selectors';
import Screen5 from '../screen5';
import { LinkToExplorer } from '../../../components/LinkToExplorer';

const StyledContent = styled.div`
  height: 600px;
  background: var(--sales-background);
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
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

export default function Screen3() {
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
      <div className="d-flex flex-row">
        <BackButton />
      </div>
      <p className="content-header">
        Please enter your code to gain access
        <br /> to the SOV* Genesis Sale
      </p>
      {codeError && <div className="text-danger">{codeError}</div>}
      {upgradeLoading && (
        <div className="text-info">
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
      <a
        href="/sales#"
        onClick={e => {
          e.preventDefault();
          dispatch(actions.changeStep(6));
        }}
      >
        Don’t have a code? Click to learn more about SOVRYN
      </a>
    </StyledContent>
  );
}
