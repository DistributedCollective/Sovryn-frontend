import React from 'react';
import styled, { css } from 'styled-components/macro';

const H1 = styled.h1`
  font-weight: 500;
  text-transform: none;
  text-align: left;
  margin-bottom: 28px;

  > .step {
    font-size: 48px;
    letter-spacing: 4.3px;
  }

  > .title {
    font-size: 26px;
    line-height: 24px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
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
      padding-bottom: 30px;
      margin: 0 auto;
      @media (min-width: 768px) {
        min-width: 450px;
      }
      @media (min-width: 1200px) {
        min-width: 370px;
      }
      @media (min-width: 1300px) {
        min-width: 450px;
      }
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
      <H1 className="tw-flex tw-w-full tw-justify-start tw-items-end disable-content">
        <span className="step">{props.step}.</span>{' '}
        <span className="title">{props.title}</span>
      </H1>
      <div className="tw-w-full tw-mb-4">{props.children}</div>
    </Container>
  );
}
