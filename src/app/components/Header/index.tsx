import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import iconNewTab from 'assets/images/iconNewTab.svg';
import { usePageViews } from 'app/hooks/useAnalytics';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { MenuItem, Menu as BPMenu, Position, Popover } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { translations } from 'locales/i18n';
import {
  reducer as lendBorrowReducer,
  sliceKey as lendBorrowSlice,
} from '../../pages/BorrowPage/slice';
import { lendBorrowSovrynSaga } from '../../pages/BorrowPage/saga';
import WalletConnector from '../../containers/WalletConnector';
import { LanguageToggle } from '../LanguageToggle';
import { currentNetwork } from 'utils/classifiers';
import styles from './index.module.scss';
import { StyledBurger, StyledLogo, StyledMenu } from './styled';

const bridgeURL =
  currentNetwork === 'mainnet'
    ? 'https://bridge.sovryn.app'
    : 'https://bridge.test.sovryn.app/';

export function Header() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);

  usePageViews();
  useInjectReducer({ key: lendBorrowSlice, reducer: lendBorrowReducer });
  useInjectSaga({ key: lendBorrowSlice, saga: lendBorrowSovrynSaga });

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
    {
      to: '/buy-sov',
      title: t(translations.mainMenu.buySov),
      exact: true,
      dataAttribute: 'header-trade-link-buySov',
    },
    {
      to: '/swap',
      title: t(translations.mainMenu.swap),
      dataAttribute: 'header-trade-link-swap',
    },
    {
      to: '/spot',
      title: t(translations.mainMenu.spotTrade),
      dataAttribute: 'header-trade-link-spot',
    },
    {
      to: '/trade',
      title: t(translations.mainMenu.marginTrade),
      dataAttribute: 'header-trade-link-margin',
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
      dataAttribute: 'header-finance-link-lend',
    },
    {
      to: '/borrow',
      title: t(translations.mainMenu.borrow),
      dataAttribute: 'header-finance-link-borrow',
    },
    {
      to: '/yield-farm',
      title: t(translations.mainMenu.yieldFarm),
      dataAttribute: 'header-finance-link-yieldFarm',
    },
    {
      to: 'https://bitocracy.sovryn.app',
      title: t(translations.mainMenu.governance),
      dataAttribute: 'header-bitocracy-link-governance',
    },
    {
      to: '/stake',
      title: t(translations.mainMenu.staking),
      dataAttribute: 'header-bitocracy-link-stake',
    },
    {
      to: '/reward',
      title: t(translations.mainMenu.reward),
      dataAttribute: 'header-bitocracy-link-rewards',
    },
    {
      to: '/wallet',
      title: t(translations.mainMenu.wallet),
      dataAttribute: 'header-link-portfolio',
    },
    {
      to: bridgeURL,
      title: t(translations.mainMenu.bridge),
      dataAttribute: 'header-link-bridge',
    },
    {
      to: '/origins',
      title: t(translations.mainMenu.origins),
      dataAttribute: 'header-origins-link-launchpad',
    },
    {
      to: '/origins/claim',
      title: t(translations.mainMenu.originsClaim),
      dataAttribute: 'header-origins-link-claim',
    },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
      dataAttribute: 'header-link-help',
    },
  ];
  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      dataAttribute: string;
      onClick?: () => void;
      beforeOpen?: () => void;
    } = item;

    if (link.to.startsWith('http')) {
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
          rel="noreferrer noopener"
          data-action-id={link.dataAttribute}
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
        data-action-id={link.dataAttribute}
      />
    );
  });

  const NavPopover = ({ content, children }) => {
    return (
      <Popover
        interactionKind="hover"
        minimal={true}
        popoverClassName={styles.headerNavPopover}
        content={content}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_LEFT}
        className="hover:tw-text-secondary"
      >
        {children}
      </Popover>
    );
  };

  const SECTION_TYPE = {
    TRADE: 'trade',
    FINANCE: 'finance',
    BITOCRACY: 'bitocracy',
    ORIGINS: 'origins',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/buy-sov', '/trade', '/swap'],
      [SECTION_TYPE.FINANCE]: ['/lend', '/yield-farm'],
      [SECTION_TYPE.BITOCRACY]: ['/stake'],
      [SECTION_TYPE.ORIGINS]: ['/origins', '/origins/claim'],
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
      <header className={classNames(styles.header, open && styles.open)}>
        <div className="tw-container tw-flex tw-justify-between tw-items-center tw-pt-2 tw-pb-2 tw-px-4 tw-mx-auto">
          <div className="xl:tw-hidden">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          </div>
          <div className="xl:tw-flex tw-flex-row tw-items-center">
            <div className="tw-mr-5 2xl:tw-mr-20">
              <Link to="/">
                <StyledLogo />
              </Link>
            </div>
            <div className="tw-hidden xl:tw-flex tw-flex-row tw-flex-nowrap tw-space-x-4 2xl:tw-space-x-10">
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.buySov)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/buy-sov');
                      }}
                      data-action-id="tradeMenu-buy-sov-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.swap)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/swap');
                      }}
                      data-action-id="tradeMenu-swap-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.spotTrade)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/spot');
                      }}
                      data-action-id="tradeMenu-spot-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.marginTrade)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/trade');
                      }}
                      data-action-id="tradeMenu-margin-btn"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.TRADE) && 'tw-font-bold'
                  }`}
                >
                  <span
                    className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                    data-action-id="headerMenu-trade-btn"
                  >
                    {t(translations.mainMenu.trade)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.lend)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/lend')}
                      data-action-id="financeMenu-lend-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.borrow)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/borrow')}
                      data-action-id="financeMenu-borrow-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.yieldFarm)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/yield-farm')}
                      data-action-id="financeMenu-yieldFarm-btn"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.FINANCE) && 'tw-font-bold'
                  }`}
                >
                  <span
                    className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                    data-action-id="headerMenu-finance-btn"
                  >
                    {t(translations.mainMenu.finance)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.staking)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/stake');
                      }}
                      data-action-id="bitocracyMenu-stake-btn"
                    />
                    <MenuItem
                      icon={
                        <img
                          src={iconNewTab}
                          alt="newTab"
                          className="tw-w-4 tw-h-4"
                        />
                      }
                      href="https://bitocracy.sovryn.app/"
                      target="_blank"
                      text={t(translations.mainMenu.governance)}
                      className="bp3-popover-dismiss"
                      data-action-id="bitocracyMenu-governance-btn"
                    />
                    <MenuItem
                      icon={
                        <img
                          src={iconNewTab}
                          alt="newTab"
                          className="tw-w-4 tw-h-4"
                        />
                      }
                      href="https://forum.sovryn.app/"
                      target="_blank"
                      text={t(translations.mainMenu.forum)}
                      className="bp3-popover-dismiss"
                      data-action-id="bitocracyMenu-forum-btn"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.BITOCRACY) && 'font-weight-bold'
                  }`}
                >
                  <span
                    className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                    data-action-id="headerMenu-bitocracy-btn"
                  >
                    {t(translations.mainMenu.bitocracy)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavLink
                className="tw-header-link tw-mr-2 2xl:tw-mr-3"
                to="/reward"
                data-action-id="headerMenu-reward-btn"
              >
                {t(translations.mainMenu.rewards)}
              </NavLink>

              <NavLink
                className="tw-header-link tw-mr-2 2xl:tw-mr-3"
                to="/wallet"
                data-action-id="headerMenu-portfolio-btn"
              >
                {t(translations.mainMenu.wallet)}
              </NavLink>
              <a
                href={bridgeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="tw-header-link"
                data-action-id="headerMenu-bridge-btn"
              >
                {t(translations.mainMenu.bridge)}
              </a>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.launchpad)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/origins')}
                      data-action-id="originsMenu-launchpad-btn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.claim)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/origins/claim')}
                      data-action-id="originsMenu-claim-btn"
                    />
                  </BPMenu>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.ORIGINS) && 'tw-font-bold'
                  }`}
                >
                  <span
                    className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                    data-action-id="headerMenu-origins-btn"
                  >
                    {t(translations.mainMenu.origins)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
            </div>
          </div>
          <div className="tw-flex tw-justify-start tw-items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-header-link tw-hidden xl:tw-block"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="2xl:tw-mr-4">
              <LanguageToggle />
            </div>
            <WalletConnector simpleView={false} />
          </div>
        </div>
      </header>
    </>
  );
}
