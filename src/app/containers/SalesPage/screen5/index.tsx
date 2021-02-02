import React from 'react';
import styled from 'styled-components/macro';
import SalesButton from 'app/components/SalesButton';
import { useDispatch } from 'react-redux';
import { actions } from '../slice';

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
  padding: 40px 15px;
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

interface Props {
  content?: React.ReactNode;
  toStep?: number;
}

export default function Screen5(props: Props) {
  const dispatch = useDispatch();
  return (
    <StyledContent>
      {props.content}
      <SalesButton
        text={'Continue to sale'}
        onClick={() => dispatch(actions.changeStep(props.toStep || 2))}
      />
    </StyledContent>
  );
}

Screen5.defaultProps = {
  content: (
    <p className="content-header">
      Your request has been submitted
      <br />
      Please check your email and wait up to 24hrs{' '}
    </p>
  ),
  toStep: 2,
};
