/**
 *
 * Header
 *
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import styled from 'styled-components/macro';
import logoSvg from 'assets/images/sovryn-logo-white.svg';
import iconNewTab from 'assets/images/iconNewTab.svg';
import { usePageViews } from 'app/hooks/usePageViews';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { MenuItem, Popover, Menu as BPMenu, Position } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { translations } from 'locales/i18n';
import {
  actions as lendBorrowActions,
  reducer as lendBorrowReducer,
  sliceKey as lendBorrowSlice,
} from '../../containers/LendBorrowSovryn/slice';
import {
  actions as tradeSwapActions,
  reducer as tradeSwapReducer,
  sliceKey as tradeSwapSlice,
} from '../../containers/TradingPage/slice';
import { lendBorrowSovrynSaga } from '../../containers/LendBorrowSovryn/saga';
import { TabType as LendBorrowTabType } from '../../containers/LendBorrowSovryn/types';
import { tradingPageSaga } from '../../containers/TradingPage/saga';
import { TabType as TradeSwapTabType } from '../../containers/TradingPage/types';
import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import { media } from '../../../styles/media';
import './index.scss';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const node = useRef(null as any);

  usePageViews();
  useInjectReducer({ key: lendBorrowSlice, reducer: lendBorrowReducer });
  useInjectSaga({ key: lendBorrowSlice, saga: lendBorrowSovrynSaga });
  useInjectReducer({ key: tradeSwapSlice, reducer: tradeSwapReducer });
  useInjectSaga({ key: tradeSwapSlice, saga: tradingPageSaga });

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
    bottom: 0;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
    z-index: 9;
    width: 100%;
    li {
      list-style-type: none;
    }
    a {
      font-size: 1.2rem;
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
    { to: '/', title: t(translations.mainMenu.buySov), exact: true },
    {
      to: '/trade',
      title: t(translations.mainMenu.swap),
      beforeOpen: () => {
        dispatch(tradeSwapActions.changeTab(TradeSwapTabType.SWAP));
      },
    },
    {
      to: '/trade',
      title: t(translations.mainMenu.marginTrade),
      beforeOpen: () => {
        dispatch(tradeSwapActions.changeTab(TradeSwapTabType.TRADE));
      },
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
      beforeOpen: () => {
        dispatch(lendBorrowActions.changeTab(LendBorrowTabType.LEND));
      },
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.borrow),
      beforeOpen: () => {
        dispatch(lendBorrowActions.changeTab(LendBorrowTabType.BORROW));
      },
    },
    { to: '/liquidity', title: t(translations.mainMenu.liquidity) },
    { to: '/mining', title: t(translations.mainMenu.mining) },
    {
      to: 'https://bitocracy.sovryn.app/stake',
      title: t(translations.mainMenu.staking),
    },
    {
      to: 'https://bitocracy.sovryn.app',
      title: t(translations.mainMenu.governance),
    },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
    { to: '/stats', title: t(translations.mainMenu.stats) },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
    },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
  ];
  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      exact: boolean;
      onClick?: () => void;
      beforeOpen?: () => void;
    } = item as any;

    if (link.to.startsWith('http')) {
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
          rel="noreferrer noopener"
        />
      );
    }

    return (
      <MenuItem
        key={index}
        text={link.title}
        onClick={() => {
          link.beforeOpen && link.beforeOpen();
          link.onClick ? link.onClick() : history.push(link.to);
          setOpen(false);
        }}
      />
    );
  });

  const StyledPopover = styled(Popover)`
    &:hover {
      color: #fec006;
    }
  `;
  const NavPopover = ({ content, children }) => {
    return (
      <StyledPopover
        interactionKind="hover"
        className="mr-4 cursor-pointer"
        minimal={true}
        popoverClassName="header-nav-popover"
        content={content}
        position={Position.BOTTOM_LEFT}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
      >
        {children}
      </StyledPopover>
    );
  };

  const SECTION_TYPE = {
    TRADE: 'trade',
    FINANCE: 'finance',
    BITOCRACY: 'bitocracy',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/trade'],
      [SECTION_TYPE.FINANCE]: ['/lend', '/liquidity', '/mining'],
      [SECTION_TYPE.BITOCRACY]: [''],
    };
    return section && paths[section].includes(location.pathname);
  };

  useEffect(() => {
    const body = document.body;
    const root = document.getElementById('root');
    if (open) {
      window.scrollTo(0, 0);
      body.classList.add('overflow-hidden');
      root?.classList.add('openedMenu');
    } else {
      body.classList.remove('overflow-hidden');
      root?.classList.remove('openedMenu');
    }
    return () => {
      body.classList.remove('overflow-hidden');
      root?.classList.remove('openedMenu');
    };
  }, [open]);

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
            <div className="d-none d-xl-block font-family-montserrat">
              <NavLink className="nav-item mr-4" to="/" exact>
                {t(translations.mainMenu.buySov)}
              </NavLink>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.swap)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        dispatch(
                          tradeSwapActions.changeTab(TradeSwapTabType.SWAP),
                        );
                        history.push('/trade');
                      }}
                    />
                    <MenuItem
                      text={t(translations.mainMenu.marginTrade)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        dispatch(
                          tradeSwapActions.changeTab(TradeSwapTabType.TRADE),
                        );
                        history.push('/trade');
                      }}
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`${
                    isSectionOpen(SECTION_TYPE.TRADE) && 'font-weight-bold'
                  }`}
                >
                  <span className="mr-1">{t(translations.mainMenu.trade)}</span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.lend)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        dispatch(
                          lendBorrowActions.changeTab(LendBorrowTabType.LEND),
                        );
                        history.push('/lend');
                      }}
                    />
                    <MenuItem
                      text={t(translations.mainMenu.borrow)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        dispatch(
                          lendBorrowActions.changeTab(LendBorrowTabType.BORROW),
                        );
                        history.push('/lend');
                      }}
                    />
                    <MenuItem
                      text={t(translations.mainMenu.liquidity)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/liquidity')}
                    />
                    <MenuItem
                      text={t(translations.mainMenu.mining)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/mining')}
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`${
                    isSectionOpen(SECTION_TYPE.FINANCE) && 'font-weight-bold'
                  }`}
                >
                  <span className="mr-1">
                    {t(translations.mainMenu.finance)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>

              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      icon={<img src={iconNewTab} alt="newTab" />}
                      href="https://bitocracy.sovryn.app/stake"
                      target="_blank"
                      text={t(translations.mainMenu.staking)}
                      className="bp3-popover-dismiss"
                    />
                    <MenuItem
                      icon={<img src={iconNewTab} alt="newTab" />}
                      href="https://bitocracy.sovryn.app/"
                      target="_blank"
                      text={t(translations.mainMenu.governance)}
                      className="bp3-popover-dismiss"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`${
                    isSectionOpen(SECTION_TYPE.BITOCRACY) && 'font-weight-bold'
                  }`}
                >
                  <span className="mr-1">
                    {t(translations.mainMenu.bitocracy)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavLink className="nav-item mr-4 text-capitalize" to="/wallet">
                {t(translations.mainMenu.wallet)}
              </NavLink>
              <NavLink className="nav-item mr-4 text-capitalize" to="/stats">
                {t(translations.mainMenu.stats)}
              </NavLink>
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item mr-2 text-capitalize d-none d-xl-block"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="mr-2">
              <LanguageToggle />
            </div>
            <WalletConnector simpleView={false} />
          </div>
        </Container>
      </header>
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
