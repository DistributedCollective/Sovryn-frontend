import React, { useState } from 'react';
import styled from 'styled-components/macro';
import SalesButton from '../../../components/SalesButton';
import { useDispatch } from 'react-redux';

import { actions } from '../slice';
import { actions as fActions } from '../../FastBtcForm/slice';
import { useAccount } from 'app/hooks/useAccount';

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

export default function Screen3() {
  const [code, setCode] = useState('');

  const dispatch = useDispatch();
  const account = useAccount();
  const handleSubmit = () => {
    dispatch(fActions.useCode({ address: account, code }));
    dispatch(actions.changeStep(4));
  };

  return (
    <StyledContent>
      <p className="content-header">
        Please enter your code to gain access
        <br /> to the SOV* Genesis Sale
      </p>
      <StyledInput
        placeholder="Enter code"
        name="code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />

      <SalesButton text={'Submit Code'} onClick={handleSubmit} />
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
