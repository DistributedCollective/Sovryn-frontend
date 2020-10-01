/**
 *
 * Header
 *
 */
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { ConnectWalletButton } from '../../containers/ConnectWalletButton';

export function Header() {
  const pages = [
    { to: '/', title: 'Trade', exact: true },
    'Lend',
    'Liquidity',
    'Stats',
    'FAQs',
  ];

  const [show, setShow] = useState(false);

  const pageNavs = pages.map((item, index) => {
    let link: { to: string; title: string; exact: boolean } = item as any;

    if (typeof item === 'string') {
      link = {
        to: `/${item.toLowerCase()}`,
        title: item,
        exact: false,
      };
    }

    return (
      <li
        key={index}
        className="nav-item list-group-item border-0 bg-transparent"
      >
        <NavLink
          className="text-decoration-none nav-link"
          to={link.to}
          exact={link.exact}
        >
          <h4>{link.title}</h4>
        </NavLink>
      </li>
    );
  });

  return (
    <>
      <header className="mb-2 shadow d-flex">
        <div className="container">
          <nav className="navbar navbar-expand-lg px-0">
            <Link to="/">
              <img className="navbar-brand" src={logoSvg} alt="Logo" />
            </Link>
            <button
              className="navbar-toggler custom-toggler navbar-dark "
              type="button"
              onClick={() => setShow(prevState => !prevState)}
            >
              <span className="navbar-toggler-icon custom-toggler" />
            </button>

            <div
              className={`collapse navbar-collapse w-100 ${show && 'show'}`}
              id="navbar-collaps"
            >
              <ul className="nav navbar-nav list-unstyled list-group list-group-horizontal-lg w-100 justify-content-lg-end">
                {pageNavs}
              </ul>
            </div>
          </nav>
        </div>
      </header>
      <div className="container mt-3">
        <ConnectWalletButton />
      </div>
    </>
  );
}
