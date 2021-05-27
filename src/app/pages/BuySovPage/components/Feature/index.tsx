import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';

interface Props {
  reverse?: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  image: string;
  imageStyle?: React.StyleHTMLAttributes<any>;
  cta: string;
  href: string;
}

export function Feature(props: Props) {
  return (
    <Article className="d-flex w-100 flex-column justify-content-start align-items-start flex-lg-row justify-content-lg-between align-items-lg-center">
      <div className={`${props.reverse ? 'order-lg-1' : 'order-lg-0'} order-1`}>
        <h1>{props.title}</h1>
        <div className="content tw-font-thin tw-leading-snug">
          {props.content}
        </div>
        {props.href.startsWith('http') ? (
          <a
            href={props.href}
            className="button"
            target="_blank"
            rel="noreferrer noopener"
          >
            {props.cta}
          </a>
        ) : (
          <NavLink to={props.href} className="button">
            {props.cta}
          </NavLink>
        )}
      </div>
      <Img
        src={props.image}
        alt="Item"
        style={props.imageStyle}
        className={`${
          props.reverse ? 'order-lg-0 img-reverse' : 'order-lg-1 img-normal'
        } order-0`}
      />
    </Article>
  );
}

const Article = styled.article`
  max-width: 1200px;
  margin: 70px auto;
  font-size: 16px;
  font-weight: 400;
  h1 {
    text-transform: none;
    font-size: 26px;
    line-height: 32px;
    font-weight: 700;
    margin-bottom: 32px;
  }

  @media screen and (min-width: 992px) {
    .img-reverse {
      margin-right: 175px;
    }
    .img-normal {
      margin-left: 175px;
    }
  }

  @media screen and (max-width: 991px) {
    .img-reverse,
    .img-normal {
      margin: 15px auto 25px;
    }
  }

  .button {
    width: 200px;
    height: 40px;
    background: #2274a5;
    border: 1px solid #2274a5;
    color: #e9eae9;
    font-size: 16px;
    line-height: 1;
    font-weight: 500;
    display: inline-block;
    border-radius: 10px;
    text-decoration: none;
    text-align: center;
    padding: 11px;
    margin-top: 40px;
    &:hover {
      opacity: 0.75;
      color: #e9eae9;
    }
  }

  a {
    text-decoration: underline;
    color: #fec004;
    &:hover {
      color: #fec004;
      text-decoration: none;
    }
  }
`;

const Img = styled.img`
  width: 450px;
  height: 303px;
  @media (max-width: 640px) {
    width: auto;
    height: auto;
    max-width: 100%;
    margin-bottom: 20px;
  }
`;
