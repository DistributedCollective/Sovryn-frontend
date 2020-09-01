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
          <div className="d-flex flex-column justify-content-around align-items-center flex-grow-1">
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
          <div>
            <iframe
              title="Discord"
              src="https://discordapp.com/widget?id=729675474665603133&theme=dark"
              width="350"
              height="500"
              allowTransparency={true}
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </>
  );
}
