/**
 *
 * Header
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import logoSvg from 'assets/images/sovryn-logo-black.svg';

export function Header() {
  return (
    <header className="mb-5 shadow">
      <div className="container py-3">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <Link to="/">
            <LogoImg src={logoSvg} alt="Logo" />
          </Link>
          <ul className="list-unstyled list-group list-group-horizontal">
            <li className="list-group-item">
              <Link to="/lend">Lend</Link>
            </li>
            <li className="list-group-item">
              <Link to="/trade">Trade</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

const LogoImg = styled.img`
  width: 200px;
  height: 44px;
`;
