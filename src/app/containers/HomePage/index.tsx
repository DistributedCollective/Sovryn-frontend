import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDrizzle } from '../../hooks/useDrizzle';
import { useAccount } from '../../hooks/useAccount';

export function HomePage() {
  const account = useAccount();
  const drizzle = useDrizzle();
  useEffect(() => {
    if (account) {
      drizzle.web3.eth.getBalance(account).then(e => console.log(e));
    }
  }, [drizzle, account]);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="Sovryn Homepage" />
      </Helmet>
      <div className="container vh-100 d-flex flex-row align-items-center justify-content-center">
        <div className="container d-flex flex-row justify-content-between">
          <div>
            <Link to="/lend" className="bp3-button px-5 py-3">
              Lend
            </Link>
          </div>
          <div>
            <Link to="/trade" className="bp3-button px-5 py-3">
              Trade
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
