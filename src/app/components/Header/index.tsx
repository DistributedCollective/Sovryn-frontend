/**
 *
 * Header
 *
 */
import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { translations } from 'locales/i18n';
import { Container } from 'react-bootstrap';

import WalletConnector from '../../containers/WalletConnector';
import styled from 'styled-components/macro';

import { Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { LanguageToggle } from '../LanguageToggle';
import { media } from '../../../styles/media';
import { WhitelistedNotification } from '../WhitelistedNotification/Loadable';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();

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

  const dropDownMenu = <Menu>{menuItems}</Menu>;

  return (
    <>
      <header>
        <Container className="d-flex justify-content-between align-items-center mb-3 pt-2 pb-2">
          <div className="d-xl-none">
            <Popover content={<Menu>{dropDownMenu}</Menu>}>
              <button className="hamburger" type="button">
                <Icon icon="menu" />
              </button>
            </Popover>
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
