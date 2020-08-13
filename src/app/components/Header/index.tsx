/**
 *
 * Header
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Link, NavLink } from 'react-router-dom';
import logoSvg from 'assets/images/sovryn-logo-white.svg';

export function Header() {
  return (
    <header className="mb-2 shadow d-flex">
      <div className="container p-0">
        <nav className="navbar navbar-expand-lg">
          <Link to="/">
            <img className="navbar-brand" src={logoSvg} alt="Logo" />
          </Link>
          <button
            className="navbar-toggler navbar-dark "
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon color-customTeal"></span>
          </button>

          <div
            className="collapse navbar-collapse w-100 "
            id="navbarSupportedContent"
          >
            <ul className="nav navbar-nav list-unstyled list-group list-group-horizontal w-100 flex-row-reverse">
              <NavItem className="nav-item list-group-item">
                <NavLink
                  className="text-customTeal text-decoration-none nav-link"
                  to="/lend"
                >
                  Lend
                </NavLink>
              </NavItem>
              <NavItem className="nav-item list-group-item">
                <Link
                  className="text-customTeal text-decoration-none nav-link"
                  to="/trade"
                >
                  Trade
                </Link>
              </NavItem>
              <NavItem className="nav-item list-group-item">
                <Link
                  className="text-customTeal text-decoration-none nav-link"
                  to="/stats"
                >
                  Stats
                </Link>
              </NavItem>
              <NavItem className="nav-item list-group-item">
                <Link
                  className="text-customTeal text-decoration-none nav-link"
                  to="/faq"
                >
                  FAQ
                </Link>
              </NavItem>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

const LogoImg = styled.img`
  width: 20em;
`;

const NavItems = styled.ul`
  background: none;
`;

const NavItem = styled.li`
  background: none;
  font-size: 1.5em;
  color: white;
`;
