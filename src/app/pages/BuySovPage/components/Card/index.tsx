import React from 'react';
import styled, { css } from 'styled-components/macro';

const H1 = styled.h1`
  font-weight: 500;
  text-transform: none;
  text-align: left;
  margin-bottom: 25px;
  .step {
    font-size: 48px;
    letter-spacing: 4.3px;
  }
  .title {
    font-size: 26px;
    letter-spacing: 0;
    position: relative;
    top: -5px;
  }
`;

interface ContainerProps {
  disabled?: boolean;
  large?: boolean;
}

const Container = styled.article`
  width: 298px;
  height: 410px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 20px;

  a {
    font-size: 16px;
    color: #2274a5;
    font-weight: 500;
    &:hover {
      color: #2274a5;
      text-decoration: none;
    }
  }
  .disable-content {
    ${(props: ContainerProps) =>
      props.disabled &&
      css`
        opacity: 25%;
      `}
  }

  ${props =>
    props.large &&
    css`
      width: 450px;
      height: 645px;
      padding-left: 65px;
      padding-right: 65px;
      padding-bottom: 50px;
    `}
`;

interface Props {
  step: number;
  title: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  large?: boolean;
}

export function Card(props: Props) {
  return (
    <Container
      disabled={props.disabled}
      large={props.large}
      className="d-block p-4 bg-black d-flex flex-column justify-content-start align-items-center flex-grow-0 flex-shrink-0"
    >
      <H1 className="d-flex w-100 justify-content-start align-items-end disable-content">
        <span className="step">{props.step}.</span>{' '}
        <span className="title">{props.title}</span>
      </H1>
      <div className="w-100">{props.children}</div>
    </Container>
  );
}
