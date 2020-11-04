/**
 *
 * Header
 *
 */
import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { Container } from 'react-bootstrap';
import WalletConnector from '../../containers/WalletConnector';
import styled from 'styled-components';
import { Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { media } from '../../../styles/media';

export function Header() {
  const history = useHistory();

  const pages = [
    { to: '/', title: 'Trade', exact: true },
    { to: '/lend', title: 'Lend / Borrow' },
    { to: '/liquidity', title: 'Liquidity' },
    { to: '/fast-btc', title: 'Fast-BTC' },
    'Stats',
    'FAQs',
  ];

  const menuItems = pages.map((item, index) => {
    let link: { to: string; title: string; exact: boolean } = item as any;

    if (typeof item === 'string') {
      link = {
        to: `/${item.toLowerCase()}`,
        title: item,
        exact: false,
      };
    }

    return (
      <MenuItem
        key={index}
        text={link.title}
        onClick={() => history.push(link.to)}
      />
    );
  });

  const dropDownMenu = <Menu>{menuItems}</Menu>;

  return (
    <>
      <header>
        <Container className="d-flex justify-content-between align-items-center mt-4 mb-5">
          <div className="d-xl-none">
            <StyledMenuButton>
              <Popover content={<Menu>{dropDownMenu}</Menu>}>
                <Icon icon="menu" />
              </Popover>
            </StyledMenuButton>
          </div>
          <div className="mr-3">
            <Link to="/">
              <StyledLogo src={logoSvg} />
            </Link>
          </div>
          <div className="d-xl-flex flex-row align-items-center">
            <div className="d-none d-xl-block">
              <NavLink className="nav-item mr-4" to="/" exact>
                Trade
              </NavLink>
              <NavLink className="nav-item mr-4" to="/lend">
                Lend/Borrow
              </NavLink>
              <NavLink className="nav-item mr-4" to="/fast-btc">
                Fast-Btc
              </NavLink>
              <NavLink className="nav-item mr-4" to="/liquidity">
                Liquidity
              </NavLink>
              <NavLink className="nav-item mr-4" to="/stats">
                Stats
              </NavLink>
            </div>
            <WalletConnector />
          </div>
        </Container>
      </header>
    </>
  );
}

const StyledLogo = styled.img.attrs(_ => ({
  alt: '',
}))`
  width: 114px;
  height: 48px;
  margin: 0 15px;
  ${media.xl`
  width: 138px;
  height: 58px;
  margin: 0 15px 0 0;
  `}
`;

const StyledMenuButton = styled.button`
  width: 48px;
  height: 48px;
  text-align: left;
  padding-left: 0;
  color: var(--white);
  background: none;
  border: none;
`;
