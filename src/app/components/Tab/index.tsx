import React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
  active: boolean;
}

export function Tab(props: Props) {
  return (
    <>
      {props.active && <ActiveDiv>{props.text}</ActiveDiv>}
      {!props.active && <InactiveDiv>{props.text}</InactiveDiv>}
    </>
  );
}

const ActiveDiv = styled.div`
  background-color: var(--component-bg);
  color: white;
  padding: 5px;
  cursor: pointer;
  text-align: center;
  margin: 0;
`;

const InactiveDiv = styled.div`
  color: var(--Grey_text);
  padding: 5px;
  cursor: pointer;
  text-align: center;
  margin: 0;
`;
