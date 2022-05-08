import React from 'react';
import styled, { css } from 'styled-components/macro';

type H2Props = {
  step: number;
};

const H2 = styled.h2<H2Props>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
  text-transform: none;
  font-weight: 500 !important;
  line-height: 26px !important;
  text-align: left;
  vertical-align: baseline;
  margin-bottom: 35px !important;

  & > :first-child {
    display: inline-block;
    font-size: 3rem;
    line-height: 1;
    letter-spacing: 0.21px;
    margin-right: 10px;
    text-align: right;
    font-feature-settings: normal;
    font-variant-numeric: normal;
  }

  & > :not(:first-child) {
    font-size: 1.75rem;
    line-height: 1;
    font-weight: 600;
    letter-spacing: 0;
    margin-bottom: 3px;
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
  font-size: 1rem;
  font-weight: 400;
  border-radius: 1.25rem;
  padding: 15px 30px;
  @media (max-width: 768px) {
    width: 100%;
  }
  a {
    font-size: 1rem;
    color: #2a8fcc;
    font-weight: 400;
    text-decoration: underline;
    &:hover {
      color: #2a8fcc;
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
      className="tw-bg-black tw-flex tw-flex-col tw-justify-start tw-items-center tw-flex-grow-0 tw-flex-shrink-0"
    >
      <H2 step={props.step}>
        <span>{props.step}.</span>
        <span>{props.title}</span>
      </H2>
      <div className="tw-w-full tw-mb-4">{props.children}</div>
    </Container>
  );
}
