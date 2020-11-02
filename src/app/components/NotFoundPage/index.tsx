import React from 'react';
import styled from 'styled-components/macro';
import { P } from './P';
import { Helmet } from 'react-helmet-async';
import { Header } from '../Header';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Header />
      <Wrapper>
        <Title>
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </Title>
        <P>Page not found.</P>
        <Link to={'/'}>Go home</Link>
      </Wrapper>
      <Footer />
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
  color: var(--white);
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  font-size: 3.375rem;

  span {
    font-size: 3.125rem;
  }
`;
