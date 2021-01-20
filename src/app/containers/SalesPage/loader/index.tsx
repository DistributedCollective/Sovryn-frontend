import React from 'react';
import styled from 'styled-components/macro';
import BackButton from '../BackButton';

const StyledContent = styled.div`
  height: 620px;
  background: var(--sales-background);
  max-width: 1235px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  position: relative;
  .content-header {
    font-size: 28px;
    text-align: center;
    margin-top: 5.5rem;
  }
  .loader {
    position: relative;
    height: 145px;
    width: 145px;
    margin-bottom: 7rem;
    span {
      &:nth-child(1) {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: white;
        border-radius: 50%;
      }
      &:nth-child(2) {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: block;
        border-radius: 50%;
        overflow: hidden;
        animation: loaderAnimation 1s linear infinite;
        &::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          height: 100%;
          width: 100%;
          display: block;
          background-color: #fec004;
        }
      }
      &:nth-child(3) {
        position: absolute;
        top: 50px;
        left: 15%;
        color: black;
        font-family: 'Montserrat';
        text-align: center;
        font-size: 28px;
        font-weight: 300;
        letter-spacing: -2px;
      }
    }
  }
  @keyframes loaderAnimation {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface Props {
  content?: React.ReactNode;
}

export default function Loader(props: Props) {
  return (
    <StyledContent>
      <div className="d-flex flex-row">
        <BackButton />
      </div>
      {props.content}
      <div className="loader">
        <span></span>
        <span></span>
        <span>
          <p>Loading</p>
        </span>
      </div>
    </StyledContent>
  );
}
