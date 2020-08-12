import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="Sovryn Homepage" />
      </Helmet>
      <div className="container vh-100 d-flex flex-row align-items-center justify-content-center">
        <div className="container d-flex flex-row justify-content-between">
          <div>
            <Link to="/lend" className="bp3-button">
              Lend
            </Link>
          </div>
          <div>
            <Link to="/trade" className="bp3-button">
              Trade
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
