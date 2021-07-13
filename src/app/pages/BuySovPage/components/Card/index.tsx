import React from 'react';
import styled, { css } from 'styled-components/macro';

type H2Props = {
  step: number;
};

const H2 = styled.h2<H2Props>`
  display: block;
  width: 100%;
  text-transform: none;
  font-weight: 500 !important;
  line-height: 26px !important;
  text-align: left;
  vertical-align: baseline;
  margin-bottom: 35px !important;

  padding-left: ${({ step }) => (step === 1 ? '40px' : '50px')};
  text-indent: ${({ step }) => (step === 1 ? '-40px' : '-50px')};

  * {
    text-indent: initial;
  }

  & > :first-child {
    display: inline-block;
    width: ${({ step }) => (step === 1 ? '30px' : '40px')};
    font-size: 48px;
    line-height: 48px;
    letter-spacing: 0.21px;
    margin-right: 10px;
    text-align: right;
  }

  & > :not(:first-child) {
    font-size: 26px;
    letter-spacing: 0;
  }
`;

interface ContainerProps {
  disabled?: boolean;
  large?: boolean;
}

const Container = styled.article`
  width: 298px;
  max-width: 450px;
  min-height: 360px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 20px;
  padding: 15px 30px;
  @media (max-width: 768px) {
    width: 100%;
  }
  a {
    font-size: 16px;
    color: #2274a5;
    font-weight: 300;
    text-decoration: underline;
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
      width: 100%;
      min-width: 370px;
      max-width: 450px;
      padding-bottom: 30px;
      margin: 0 auto;
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
      className="d-block bg-black d-flex flex-column justify-content-start align-items-center flex-grow-0 flex-shrink-0"
    >
      <H2 step={props.step}>
        <span>{props.step}.</span>
        <span>{props.title}</span>
      </H2>
      <div className="w-100 mb-3">{props.children}</div>
    </Container>
  );
}
