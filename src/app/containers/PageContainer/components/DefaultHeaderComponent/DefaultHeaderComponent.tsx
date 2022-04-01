import { Menu as BPMenu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';

import iconNewTab from 'assets/images/iconNewTab.svg';
import { translations } from 'locales/i18n';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useIsConnected } from 'app/hooks/useAccount';

import WalletConnector from '../../../WalletConnector';
import { lendBorrowSovrynSaga } from '../../../../pages/BorrowPage/saga';
import {
  reducer as lendBorrowReducer,
  sliceKey as lendBorrowSlice,
} from '../../../../pages/BorrowPage/slice';
import { LanguageToggle } from '../../../../components/LanguageToggle';
import styles from './index.module.scss';
import { ReactComponent as SovLogo } from 'assets/images/sovryn-logo-alpha.svg';
import { currentNetwork, isMainnet } from 'utils/classifiers';
import { AppMode } from 'types';

export const DefaultHeaderComponent: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);
  const connected = useIsConnected();

  useInjectReducer({ key: lendBorrowSlice, reducer: lendBorrowReducer });
  useInjectSaga({ key: lendBorrowSlice, saga: lendBorrowSovrynSaga });

  const Menu = () => (
    <nav
      className={classNames(styles.menu, open && styles.menuOpen, {
        menuOpen: open,
      })}
      onClick={() => setOpen(!open)}
    >
      {menuItems}
    </nav>
  );

  const Burger = () => (
    <button
      className={classNames(styles.burger, open && styles.burgerOpen)}
      onClick={() => setOpen(!open)}
    >
      <div />
      <div />
      <div />
    </button>
  );

  const pages = [
    {
      to: '',
      title: t(translations.mainMenu.trade),
      dataActionId: 'header-link-trade',
    },
    {
      to: '/buy-sov',
      title: t(translations.mainMenu.buySov),
      exact: true,
      dataActionId: 'header-trade-link-buySov',
    },
    {
      to: '/swap',
      title: t(translations.mainMenu.swap),
      dataActionId: 'header-trade-link-swap',
    },
    {
      to: '/spot',
      title: t(translations.mainMenu.spotTrade),
      dataActionId: 'header-trade-link-spot',
    },
    {
      to: '/trade',
      title: t(translations.mainMenu.marginTrade),
      dataActionId: 'header-trade-link-margin',
    },
    {
      to: '',
      title: t(translations.mainMenu.finance),
      dataActionId: 'header-link-finance',
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
      dataActionId: 'header-finance-link-lend',
    },
    {
      to: '/borrow',
      title: t(translations.mainMenu.borrow),
      dataActionId: 'header-finance-link-borrow',
    },
    {
      to: '/yield-farm',
      title: t(translations.mainMenu.yieldFarm),
      dataActionId: 'header-finance-link-yieldFarm',
    },
    {
      to: '',
      title: t(translations.mainMenu.bitocracy),
      dataActionId: 'header-link-bitocracy',
    },
    {
      to: '/stake',
      title: t(translations.mainMenu.staking),
      dataActionId: 'header-bitocracy-link-stake',
    },
    {
      to: 'https://bitocracy.sovryn.app',
      title: t(translations.mainMenu.governance),
      dataActionId: 'header-bitocracy-link-governance',
    },
    {
      to: 'https://forum.sovryn.app',
      title: t(translations.mainMenu.forum),
      dataActionId: 'header-bitocracy-link-forum',
    },
    {
      to: '/reward',
      title: t(translations.mainMenu.reward),
      dataActionId: 'header-link-rewards',
    },
    {
      to: '/wallet',
      title: t(translations.mainMenu.wallet),
      dataActionId: 'header-link-portfolio',
    },
    {
      to: '',
      title: t(translations.mainMenu.origins),
      dataActionId: 'header-link-origins',
    },
    {
      to: '/origins',
      title: t(translations.mainMenu.launchpad),
      dataActionId: 'header-origins-link-launchpad',
    },
    {
      to: '/origins/claim',
      title: t(translations.mainMenu.originsClaim),
      dataActionId: 'header-link-portfolio',
    },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
      dataActionId: 'header-link-help',
    },
    {
      to: '',
      title: t(translations.mainMenu.labs),
      dataActionId: 'header-link-lab',
    },
    {
      to: '/mynt-token',
      title: t(translations.mainMenu.myntToken),
      dataActionId: 'header-link-lab-mynt-token',
    },
  ];

  if (!isMainnet) {
    pages.push({
      to: '/perpetuals',
      title: t(translations.mainMenu.perpetuals),
      dataActionId: 'header-link-lab-perpetuals',
    });
  }

  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      dataActionId: string;
      onClick?: () => void;
      beforeOpen?: () => void;
    } = item;

    if (link.to === '') {
      return (
        <div
          key={index}
          className={styles.mobileMenuSection}
          data-action-id={link.dataActionId}
        >
          {link.title}
        </div>
      );
    }

    if (link.to.startsWith('http')) {
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
          rel="noreferrer noopener"
          data-action-id={link.dataActionId}
          className="tw-leading-snug"
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
        data-action-id={link.dataActionId}
        className="tw-leading-snug"
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
    LABS: 'labs',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/buy-sov', '/trade', '/swap'],
      [SECTION_TYPE.FINANCE]: ['/lend', '/yield-farm'],
      [SECTION_TYPE.BITOCRACY]: ['/stake'],
      [SECTION_TYPE.ORIGINS]: ['/origins', '/origins/claim'],
      [SECTION_TYPE.LABS]: ['/labs', '/mynt-token', '/perpetuals'],
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
          <div className="tw-flex tw-items-center">
            <div className="xl:tw-hidden">
              <div ref={node}>
                <Burger />
                <Menu />
              </div>
            </div>
            <div className="xl:tw-flex tw-flex-row tw-items-center">
              <div className="tw-mr-5 2xl:tw-mr-20">
                <Link to="/">
                  <SovLogo className={styles.logo} />
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
                        data-action-id="header-trade-link-buySov"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.swap)}
                        className="bp3-popover-dismiss"
                        onClick={() => {
                          history.push('/swap');
                        }}
                        data-action-id="header-trade-link-swap"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.spotTrade)}
                        className="bp3-popover-dismiss"
                        onClick={() => {
                          history.push('/spot');
                        }}
                        data-action-id="header-trade-link-spot"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.marginTrade)}
                        className="bp3-popover-dismiss"
                        onClick={() => {
                          history.push('/trade');
                        }}
                        data-action-id="header-trade-link-margin"
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
                      data-action-id="header-link-trade"
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
                        data-action-id="header-finance-link-lend"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.borrow)}
                        className="bp3-popover-dismiss"
                        onClick={() => history.push('/borrow')}
                        data-action-id="header-finance-link-borrow"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.yieldFarm)}
                        className="bp3-popover-dismiss"
                        onClick={() => history.push('/yield-farm')}
                        data-action-id="header-finance-link-yieldFarm"
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
                      data-action-id="header-link-finance"
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
                        data-action-id="header-bitocracy-link-stake"
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
                        data-action-id="header-bitocracy-link-governance"
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
                        data-action-id="header-bitocracy-link-forum"
                      />
                    </BPMenu>
                  }
                >
                  <div
                    className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                      isSectionOpen(SECTION_TYPE.BITOCRACY) &&
                      'font-weight-bold'
                    }`}
                  >
                    <span
                      className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                      data-action-id="header-link-bitocracy"
                    >
                      {t(translations.mainMenu.bitocracy)}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} size="xs" />
                  </div>
                </NavPopover>
                <NavLink
                  className="tw-header-link tw-mr-2 2xl:tw-mr-3"
                  to="/reward"
                  data-action-id="header-link-rewards"
                >
                  {t(translations.mainMenu.rewards)}
                </NavLink>

                <NavLink
                  className="tw-header-link tw-mr-2 2xl:tw-mr-3"
                  to="/wallet"
                  data-action-id="header-link-portfolio"
                >
                  {t(translations.mainMenu.wallet)}
                </NavLink>
                <NavPopover
                  content={
                    <BPMenu>
                      <MenuItem
                        text={t(translations.mainMenu.launchpad)}
                        className="bp3-popover-dismiss"
                        onClick={() => history.push('/origins')}
                        data-action-id="header-origins-link-launchpad"
                      />
                      <MenuItem
                        text={t(translations.mainMenu.claim)}
                        className="bp3-popover-dismiss"
                        onClick={() => history.push('/origins/claim')}
                        data-action-id="header-origins-link-claim"
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
                      data-action-id="header-link-origins"
                    >
                      {t(translations.mainMenu.origins)}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} size="xs" />
                  </div>
                </NavPopover>
                {currentNetwork === AppMode.TESTNET && (
                  <NavPopover
                    content={
                      <BPMenu>
                        <MenuItem
                          text={t(translations.mainMenu.myntToken)}
                          className="bp3-popover-dismiss"
                          href="/mynt-token"
                          data-action-id="header-lab-mynt-token"
                        />
                        {!isMainnet && (
                          <MenuItem
                            text={t(translations.mainMenu.perpetuals)}
                            className="bp3-popover-dismiss"
                            href="/perpetuals"
                            data-action-id="header-lab-perpetuals"
                          />
                        )}
                      </BPMenu>
                    }
                  >
                    <div
                      className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                        isSectionOpen(SECTION_TYPE.LABS) && 'tw-font-bold'
                      }`}
                    >
                      <span
                        className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                        data-action-id="header-link-origins"
                      >
                        {t(translations.mainMenu.labs)}
                      </span>
                      <FontAwesomeIcon icon={faChevronDown} size="xs" />
                    </div>
                  </NavPopover>
                )}
              </div>
            </div>
          </div>

          <div className="tw-flex tw-justify-start tw-items-center">
            <Link
              className={classNames(
                'tw-btn-action tw-hidden sm:tw-flex tw-mx-2 2xl:tw-mr-4',
                {
                  'tw-hidden': !connected,
                },
              )}
              to={{
                pathname: '/wallet',
              }}
            >
              <span>{t(translations.common.deposit)}</span>
            </Link>
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-header-link tw-hidden xl:tw-block xl:tw-mr-2"
              data-action-id="header-link-help"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="2xl:tw-mr-4">
              <LanguageToggle />
            </div>
            <WalletConnector />
          </div>
        </div>
      </header>
    </>
  );
};
