import React from 'react';
import styled from 'styled-components/macro';
import { NavLink } from 'react-router-dom';

interface Props {
  title: React.ReactNode;
  content: React.ReactNode;
  cta: React.ReactNode;
  href: string;
  image: string;
  imageStyle?: React.StyleHTMLAttributes<any>;
}

export function Promotion(props: Props) {
  return (
    <Article className="tw-flex tw-w-full tw-flex-col tw-justify-start tw-items-start xl:tw-flex-row xl:tw-justify-between xl:tw-items-center">
      <div className="tw-order-1 lg:order-0">
        <h1>{props.title}</h1>
        <div className="content tw-font-thin tw-leading-snug">
          {props.content}
        </div>
        <div>
          {props.href.startsWith('http') ? (
            <a href={props.href} target="_blank" rel="noreferrer noopener">
              {props.cta}
            </a>
          ) : (
            <NavLink to={props.href}>{props.cta}</NavLink>
          )}
        </div>
      </div>
      <Img
        src={props.image}
        alt="Item"
        style={props.imageStyle}
        className="img tw-order-0 lg:tw-order-1"
      />
    </Article>
  );
}

const Article = styled.article`
  max-width: 1200px;
  margin: 0 auto 70px;
  font-size: 1rem;
  font-weight: 400;
  h1 {
    text-transform: none;
    font-size: 1.5rem;
    line-height: 32px;
    font-weight: 700;
    margin-bottom: 32px;
  }

  @media screen and (min-width: 1200px) {
    .img {
      margin-left: 250px;
    }
  }

  @media screen and (max-width: 1199px) {
    .img {
      margin: 0 auto;
    }
  }
  @media (max-width: 640px) {
    margin: 0 auto 30px;
  }

  a {
    text-decoration: underline;
    color: var(--primary);
    font-weight: 400;
    &:hover {
      color: var(--primary);
      text-decoration: none;
    }
  }

  .content {
    margin-bottom: 30px;
  }
`;

const Img = styled.img`
  width: 450px;
  height: 303px;
  @media (max-width: 640px) {
    max-width: 100%;
    margin-bottom: 20px;
  }
`;
