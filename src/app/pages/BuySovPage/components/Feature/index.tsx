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
  ctaDataActionId?: string;
}

export function Feature({
  ctaDataActionId,
  reverse,
  title,
  content,
  image,
  imageStyle,
  cta,
  href,
}: Props) {
  return (
    <Article className="tw-flex tw-w-full tw-flex-col tw-justify-start tw-items-start lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
      <div
        className={`${reverse ? 'lg:tw-order-1' : 'lg:tw-order-0'} tw-order-1`}
      >
        <h3>{title}</h3>
        <div className="content tw-font-extralight tw-leading-snug">
          {content}
        </div>
        {href.startsWith('http') ? (
          <a
            href={href}
            className="button"
            target="_blank"
            rel="noreferrer noopener"
            data-action-id={ctaDataActionId}
          >
            {cta}
          </a>
        ) : (
          <NavLink
            to={href}
            className="button"
            data-action-id={ctaDataActionId}
          >
            {cta}
          </NavLink>
        )}
      </div>
      <Img
        src={image}
        alt="Item"
        style={imageStyle}
        className={`${
          reverse ? 'lg:tw-order-0 img-reverse' : 'lg:tw-order-1 img-normal'
        } tw-order-0`}
      />
    </Article>
  );
}

const Article = styled.article`
  max-width: 1200px;
  margin: 70px auto;
  font-size: 1rem;
  font-weight: 400;

  + ${() => Article} {
    margin-top: 160px;
  }

  h3 {
    text-transform: none;
    font-size: 1.5rem;
    line-height: 1.375;
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
    background: #2a8fcc;
    border: 1px solid #2a8fcc;
    color: #e8e8e8;
    font-size: 1rem;
    line-height: 1;
    font-weight: 500;
    display: inline-block;
    border-radius: 0.75rem;
    text-decoration: none;
    text-align: center;
    padding: 11px;
    margin-top: 40px;
    &:hover {
      opacity: 0.75;
      color: #e8e8e8;
    }
  }

  a {
    text-decoration: underline;
    color: var(--primary);
    &:hover {
      color: var(--primary);
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
