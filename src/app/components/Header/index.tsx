/**
 *
 * Header
 *
 */
import React, { useState, useRef } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import styled from 'styled-components/macro';
import { MenuItem } from '@blueprintjs/core';

import { translations } from 'locales/i18n';
import logoSvg from 'assets/images/sovryn-logo-white.svg';

import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import { media } from '../../../styles/media';
import { WhitelistedNotification } from '../WhitelistedNotification/Loadable';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const node = useRef(null as any);

  const StyledMenu = styled.nav.attrs(_ => ({ open: open }))`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: black;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    height: 100%;
    text-align: left;
    padding: 4rem 2rem 2rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    transition: transform 0.3s ease-in-out;
    z-index: 9;
    width: 100%;
    li {
      list-style-type: none;
    }
    a {
      font-size: 1.2rem;
      text-transform: uppercase;
      padding: 1.5rem 0;
      font-weight: bold;
      letter-spacing: 0.5rem;
      color: white;
      text-decoration: none;
      transition: color 0.3s linear;
      text-align: center;
    }
  `;
  const StyledBurger = styled.button.attrs(_ => ({ open: open }))`
    position: absolute;
    top: 1.3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
    &:focus {
      outline: none;
    }

    div {
      width: 2rem;
      height: 0.25rem;
      background: white;
      border-radius: 10px;
      transition: all 0.3s linear;
      position: relative;
      transform-origin: 1px;
      :first-child {
        transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
      }
      :nth-child(2) {
        opacity: ${({ open }) => (open ? '0' : '1')};
        transform: ${({ open }) =>
          open ? 'translateX(20px)' : 'translateX(0)'};
      }
      :nth-child(3) {
        transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
      }
    }
  `;
  const Menu = ({ open, setOpen }) => {
    return <StyledMenu open={open}>{menuItems}</StyledMenu>;
  };
  const Burger = ({ open, setOpen }) => {
    return (
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
    );
  };
  const pages = [
    { to: '/', title: t(translations.mainMenu.trade), exact: true },
    { to: '/lend', title: t(translations.mainMenu.lend) },
    { to: '/liquidity', title: t(translations.mainMenu.liquidity) },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
    { to: '/stats', title: t(translations.mainMenu.stats) },
    {
      to: 'https://sovryn-1.gitbook.io/sovryn/',
      title: t(translations.mainMenu.faqs),
    },
  ];
  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      exact: boolean;
      onClick?: () => void;
    } = item as any;

    if (link.to.startsWith('http')) {
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
        />
      );
    }

    return (
      <MenuItem
        key={index}
        text={link.title}
        onClick={() => (link.onClick ? link.onClick() : history.push(link.to))}
      />
    );
  });

  return (
    <>
      <header>
        <Container className="d-flex justify-content-between align-items-center mb-3 pt-2 pb-2">
          <div className="d-xl-none">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          </div>
          <div className="d-xl-flex flex-row align-items-center">
            <div className="mr-3">
              <Link to="/">
                <StyledLogo src={logoSvg} />
              </Link>
            </div>
            <div className="d-none d-xl-block">
              <NavLink className="nav-item mr-4" to="/" exact>
                {t(translations.mainMenu.trade)}
              </NavLink>
              <NavLink className="nav-item mr-4" to="/lend">
                {t(translations.mainMenu.lend)}
              </NavLink>
              <NavLink className="nav-item mr-4" to="/liquidity">
                {t(translations.mainMenu.liquidity)}
              </NavLink>
              <NavLink className="nav-item mr-4" to="/wallet">
                {t(translations.mainMenu.wallet)}
              </NavLink>
              <NavLink className="nav-item mr-4" to="/stats">
                {t(translations.mainMenu.stats)}
              </NavLink>
              <a
                href="https://sovryn-1.gitbook.io/sovryn/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item mr-4"
              >
                {t(translations.mainMenu.help)}
              </a>
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <div className="mr-3">
              <LanguageToggle />
            </div>
            <WalletConnector simpleView={false} />
          </div>
        </Container>
      </header>
      <WhitelistedNotification />
    </>
  );
}

const StyledLogo = styled.img.attrs(_ => ({
  alt: '',
}))`
  width: 130px;
  height: 50px;
  margin: 0 0 0 1rem;
  ${media.xl`
    width: 284px;
    height: 48px;
    margin: 0;
  `}
`;
