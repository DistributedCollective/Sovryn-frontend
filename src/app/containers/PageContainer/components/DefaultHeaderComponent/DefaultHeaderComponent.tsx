import { Popover, Position } from '@blueprintjs/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
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
import { bitocracyUrl, currentNetwork, isMainnet } from 'utils/classifiers';
import { AppMode } from 'types';
import { Menu } from 'app/components/Menu';
import { MenuItem } from 'app/components/Menu/components/MenuItem';
import { MenuSeparator } from 'app/components/Menu/components/MenuSeparator';

export const DefaultHeaderComponent: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);
  const connected = useIsConnected();

  useInjectReducer({ key: lendBorrowSlice, reducer: lendBorrowReducer });
  useInjectSaga({ key: lendBorrowSlice, saga: lendBorrowSovrynSaga });

  const MenuMobile = () => (
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

  const perpetualPage = {
    ...((!isMainnet && {
      to: '/perpetuals',
      title: t(translations.mainMenu.perpetuals),
      dataActionId: 'header-link-lab-perpetuals',
    }) || {
      to: '',
      title: '',
      dataActionId: '',
    }),
  };

  const pages = [
    {
      to: '',
      title: t(translations.mainMenu.trade),
      dataActionId: 'header-link-trade',
    },
    {
      to: '/buy-sov',
      title: t(translations.mainMenu.buySov),
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
      to: bitocracyUrl,
      title: t(translations.mainMenu.governance),
      dataActionId: 'header-bitocracy-link-governance',
      hrefExternal: true,
    },
    {
      to: 'https://forum.sovryn.app',
      title: t(translations.mainMenu.forum),
      dataActionId: 'header-bitocracy-link-forum',
      hrefExternal: true,
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
      title: t(translations.mainMenu.labs),
      dataActionId: 'header-link-lab',
    },
    {
      to: '/mynt-token',
      title: t(translations.mainMenu.myntToken),
      dataActionId: 'header-link-lab-mynt-token',
    },
    perpetualPage,
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
      hrefExternal: true,
    },
  ];

  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      dataActionId: string;
      hrefExternal?: boolean;
    } = item;

    if (link.to === '') {
      return <MenuSeparator key={index} text={link.title} />;
    }

    return (
      <MenuItem
        key={index}
        href={link.to}
        text={link.title}
        hrefExternal={link.hrefExternal}
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
      >
        {children}
      </Popover>
    );
  };

  const SECTION_TYPE = {
    TRADE: 'trade',
    FINANCE: 'finance',
    BITOCRACY: 'bitocracy',
    REWARDS: 'rewards',
    PORTFOLIO: 'portfolio',
    LABS: 'labs',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/buy-sov', '/trade', '/swap', '/spot'],
      [SECTION_TYPE.FINANCE]: ['/lend', '/yield-farm', '/borrow'],
      [SECTION_TYPE.BITOCRACY]: ['/stake'],
      [SECTION_TYPE.REWARDS]: ['/reward'],
      [SECTION_TYPE.PORTFOLIO]: ['/wallet'],
      [SECTION_TYPE.LABS]: [
        '/labs',
        '/mynt-token',
        '/perpetuals',
        '/origins',
        '/origins/claim',
      ],
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
                <MenuMobile />
              </div>
            </div>
            <div className="xl:tw-flex tw-flex-row tw-items-center">
              <div className="tw-mr-5 2xl:tw-mr-20">
                <Link to="/">
                  <SovLogo className={styles.logo} />
                </Link>
              </div>
              <Menu className="tw-hidden xl:tw-flex tw-flex-row tw-flex-nowrap tw-space-x-4">
                <MenuItem
                  text={
                    <NavPopover
                      content={
                        <>
                          <MenuItem
                            text={t(translations.mainMenu.buySov)}
                            onClick={() => {
                              history.push('/buy-sov');
                            }}
                            data-action-id="header-trade-link-buySov"
                          />
                          <MenuItem
                            text={t(translations.mainMenu.swap)}
                            onClick={() => {
                              history.push('/swap');
                            }}
                            data-action-id="header-trade-link-swap"
                          />
                          <MenuItem
                            text={t(translations.mainMenu.spotTrade)}
                            onClick={() => {
                              history.push('/spot');
                            }}
                            data-action-id="header-trade-link-spot"
                          />
                          <MenuItem
                            text={t(translations.mainMenu.marginTrade)}
                            onClick={() => {
                              history.push('/trade');
                            }}
                            data-action-id="header-trade-link-margin"
                          />
                        </>
                      }
                    >
                      <span
                        className={`tw-flex tw-flex-row tw-items-center ${
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
                      </span>
                    </NavPopover>
                  }
                />
                <MenuItem
                  text={
                    <NavPopover
                      content={
                        <Menu>
                          <MenuItem
                            text={t(translations.mainMenu.lend)}
                            onClick={() => history.push('/lend')}
                            data-action-id="header-finance-link-lend"
                          />
                          <MenuItem
                            text={t(translations.mainMenu.borrow)}
                            onClick={() => history.push('/borrow')}
                            data-action-id="header-finance-link-borrow"
                          />
                          <MenuItem
                            text={t(translations.mainMenu.yieldFarm)}
                            onClick={() => history.push('/yield-farm')}
                            data-action-id="header-finance-link-yieldFarm"
                          />
                        </Menu>
                      }
                    >
                      <span
                        className={`tw-flex tw-flex-row tw-items-center ${
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
                      </span>
                    </NavPopover>
                  }
                />
                <MenuItem
                  text={
                    <NavPopover
                      content={
                        <Menu>
                          <MenuItem
                            text={t(translations.mainMenu.staking)}
                            onClick={() => {
                              history.push('/stake');
                            }}
                            data-action-id="header-bitocracy-link-stake"
                          />
                          <MenuItem
                            href={bitocracyUrl}
                            hrefExternal
                            text={t(translations.mainMenu.governance)}
                            data-action-id="header-bitocracy-link-governance"
                          />
                          <MenuItem
                            href="https://forum.sovryn.app/"
                            hrefExternal
                            text={t(translations.mainMenu.forum)}
                            data-action-id="header-bitocracy-link-forum"
                          />
                        </Menu>
                      }
                    >
                      <span
                        className={`tw-flex tw-flex-row tw-items-center ${
                          isSectionOpen(SECTION_TYPE.BITOCRACY) &&
                          'tw-font-bold'
                        }`}
                      >
                        <span
                          className="tw-mr-2 2xl:tw-mr-3 tw-cursor-pointer"
                          data-action-id="header-link-bitocracy"
                        >
                          {t(translations.mainMenu.bitocracy)}
                        </span>
                        <FontAwesomeIcon icon={faChevronDown} size="xs" />
                      </span>
                    </NavPopover>
                  }
                />
                <MenuItem
                  onClick={() => {
                    history.push('/reward');
                  }}
                  text={t(translations.mainMenu.rewards)}
                  data-action-id="header-link-rewards"
                  className={`${
                    isSectionOpen(SECTION_TYPE.REWARDS) && 'tw-font-bold'
                  }`}
                />
                <MenuItem
                  onClick={() => {
                    history.push('/wallet');
                  }}
                  text={t(translations.mainMenu.wallet)}
                  data-action-id="header-link-portfolio"
                  className={`tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.PORTFOLIO) && 'tw-font-bold'
                  }`}
                />
                {currentNetwork === AppMode.TESTNET && (
                  <MenuItem
                    text={
                      <NavPopover
                        content={
                          <Menu>
                            <MenuItem
                              text={t(translations.mainMenu.myntToken)}
                              href="/mynt-token"
                              data-action-id="header-lab-mynt-token"
                            />
                            {!isMainnet && (
                              <MenuItem
                                text={t(translations.mainMenu.perpetuals)}
                                href="/perpetuals"
                                data-action-id="header-lab-perpetuals"
                              />
                            )}
                            <MenuSeparator
                              text={t(translations.mainMenu.origins)}
                            />
                            <MenuItem
                              text={t(translations.mainMenu.launchpad)}
                              onClick={() => history.push('/origins')}
                              data-action-id="header-origins-link-launchpad"
                            />
                            <MenuItem
                              text={t(translations.mainMenu.claim)}
                              onClick={() => history.push('/origins/claim')}
                              data-action-id="header-origins-link-claim"
                            />
                          </Menu>
                        }
                      >
                        <span
                          className={`tw-flex tw-flex-row tw-items-center ${
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
                        </span>
                      </NavPopover>
                    }
                  />
                )}
              </Menu>
            </div>
          </div>

          <Menu className="tw-flex tw-justify-start tw-items-center">
            <li>
              <Link
                to={{
                  pathname: '/wallet',
                }}
                className={classNames(
                  'tw-btn-action tw-text-primary hover:tw-bg-transparent tw-hidden sm:tw-flex tw-mx-2 2xl:tw-mr-4',
                  {
                    'tw-hidden': !connected,
                  },
                )}
              >
                {t(translations.common.deposit)}
              </Link>
            </li>
            <MenuItem
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              hrefExternal
              text={t(translations.mainMenu.help)}
              className="tw-header-link tw-hidden xl:tw-block xl:tw-mr-2"
              data-action-id="header-link-help"
            />
            <li className="2xl:tw-mr-4">
              <LanguageToggle />
            </li>
            <li>
              <WalletConnector />
            </li>
          </Menu>
        </div>
      </header>
    </>
  );
};
