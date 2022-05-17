import { Popover, Position } from '@blueprintjs/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
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
import { bitocracyUrl, isMainnet, isStaging } from 'utils/classifiers';
import { Menu } from 'app/components/Menu';
import { MenuItem } from 'app/components/Menu/components/MenuItem';
import { MenuSeparator } from 'app/components/Menu/components/MenuSeparator';

const showPerps = !isMainnet || isStaging;

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

  const labPages = [
    {
      to: '/origins',
      title: t(translations.mainMenu.originsLaunchpad),
      dataActionId: 'header-lab-link-launchpad',
    },
    {
      to: '/origins/claim',
      title: t(translations.mainMenu.originsClaim),
      dataActionId: 'header-lab-link-claim',
    },
    {
      to: '/mynt-token',
      title: t(translations.mainMenu.myntToken),
      dataActionId: 'header-lab-link-mynt-token',
    },
  ];

  if (showPerps) {
    labPages.push({
      to: '/perpetuals',
      title: t(translations.mainMenu.perpetuals),
      dataActionId: 'header-lab-link-perpetuals',
    });
  }

  const pages = [
    {
      to: '',
      title: t(translations.mainMenu.trade),
      dataActionId: 'header-link-trade',
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
      title: '',
      dataActionId: '',
    },
    {
      to: '/borrow',
      title: t(translations.mainMenu.borrow),
      dataActionId: 'header-link-borrow',
    },
    {
      to: '',
      title: t(translations.mainMenu.earn),
      dataActionId: 'header-link-earn',
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
      dataActionId: 'header-earn-link-lend',
    },
    {
      to: '/yield-farm',
      title: t(translations.mainMenu.pool),
      dataActionId: 'header-earn-link-pool',
    },
    {
      to: '/stake',
      title: t(translations.mainMenu.staking),
      dataActionId: 'header-earn-link-stake',
    },
    {
      to: '',
      title: t(translations.mainMenu.labs),
      dataActionId: 'header-link-lab',
    },
    ...labPages,
    {
      to: '',
      title: t(translations.mainMenu.bitocracy),
      dataActionId: 'header-link-bitocracy',
    },
    {
      to: bitocracyUrl,
      title: t(translations.mainMenu.voting),
      dataActionId: 'header-bitocracy-link-voting',
      hrefExternal: true,
    },
    {
      to: 'https://forum.sovryn.app',
      title: t(translations.mainMenu.forum),
      dataActionId: 'header-bitocracy-link-forum',
      hrefExternal: true,
    },
    {
      to: '',
      title: '',
      dataActionId: '',
    },
    {
      to: '/reward',
      title: t(translations.mainMenu.reward),
      dataActionId: 'header-link-rewards',
    },
    {
      to: '/wallet',
      title: t(translations.mainMenu.portfolio),
      dataActionId: 'header-link-portfolio',
    },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
      dataActionId: 'header-link-help',
      hrefExternal: true,
    },
  ];

  const menuItems = pages
    .filter(page => page.title !== '')
    .map((item, index) => {
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
        className="hover:tw-bg-gray-2.5 tw-rounded"
        targetClassName="tw-px-3 tw-py-2"
      >
        {children}
      </Popover>
    );
  };

  const SECTION_TYPE = {
    TRADE: 'trade',
    EARN: 'earn',
    LABS: 'labs',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/swap', '/spot', '/trade'],
      [SECTION_TYPE.EARN]: ['/lend', '/yield-farm', '/stake'],
      [SECTION_TYPE.LABS]: [
        '/origins',
        '/origins/claim',
        '/labs',
        '/mynt-token',
        '/perpetuals',
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
            <div className="tw-mr-5 2xl:tw-mr-16">
              <Link to="/">
                <SovLogo className={styles.logo} />
              </Link>
            </div>
            <Menu className="tw-hidden xl:tw-flex tw-flex-row tw-flex-nowrap 2xl:tw-space-x-4 tw-items-center">
              <NavPopover
                content={
                  <>
                    <MenuItem
                      text={t(translations.mainMenu.swap)}
                      label="Some additional text"
                      onClick={() => {
                        history.push('/swap');
                      }}
                      data-action-id="header-trade-link-swap"
                      className="hover:tg-bg-gray-5"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.spotTrade)}
                      label="Some additional text"
                      onClick={() => {
                        history.push('/spot');
                      }}
                      data-action-id="header-trade-link-spot"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.marginTrade)}
                      label="Some additional text"
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
                    isSectionOpen(SECTION_TYPE.TRADE) &&
                    'tw-font-semibold tw-text-orange'
                  }`}
                >
                  <span
                    className={styles.headerText}
                    data-action-id="header-link-trade"
                  >
                    {t(translations.mainMenu.trade)}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} size="xs" />
                </span>
              </NavPopover>

              <NavLink
                className={classNames(
                  'tw-header-link hover:tw-bg-gray-2.5 hover:tw-text-sov-white tw-rounded tw-px-3 tw-py-2',
                  styles.headerText,
                )}
                to="/borrow"
                data-action-id="header-link-borrow"
              >
                {t(translations.mainMenu.borrow)}
              </NavLink>

              <NavPopover
                content={
                  <>
                    <MenuItem
                      text={t(translations.mainMenu.lend)}
                      onClick={() => history.push('/lend')}
                      data-action-id="header-earn-link-lend"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.pool)}
                      onClick={() => history.push('/yield-farm')}
                      data-action-id="header-earn-link-pool"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.staking)}
                      onClick={() => {
                        history.push('/stake');
                      }}
                      data-action-id="header-earn-link-stake"
                    />
                  </>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.EARN) && 'tw-font-semibold'
                  }`}
                >
                  <span
                    className={styles.headerText}
                    data-action-id="header-link-earn"
                  >
                    {t(translations.mainMenu.earn)}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} size="xs" />
                </div>
              </NavPopover>

              <NavPopover
                content={
                  <>
                    <MenuItem
                      text={t(translations.mainMenu.originsLaunchpad)}
                      onClick={() => history.push('/origins')}
                      data-action-id="header-lab-link-launchpad"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.originsClaim)}
                      onClick={() => history.push('/origins/claim')}
                      data-action-id="header-lab-link-claim"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.myntToken)}
                      href="/mynt-token"
                      data-action-id="header-lab-link-mynt-token"
                    />
                    {showPerps && (
                      <MenuItem
                        text={t(translations.mainMenu.perpetuals)}
                        href="/perpetuals"
                        data-action-id="header-lab-link-perpetuals"
                      />
                    )}
                  </>
                }
              >
                <div
                  className={`tw-flex-shrink-0 tw-flex tw-flex-row tw-items-center ${
                    isSectionOpen(SECTION_TYPE.LABS) && 'tw-font-semibold'
                  }`}
                >
                  <span
                    className={styles.headerText}
                    data-action-id="header-link-lab"
                  >
                    {t(translations.mainMenu.labs)}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} size="xs" />
                </div>
              </NavPopover>

              <NavPopover
                content={
                  <Menu>
                    <MenuItem
                      href={bitocracyUrl}
                      hrefExternal
                      text={t(translations.mainMenu.voting)}
                      data-action-id="header-bitocracy-link-voting"
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
                <span className="tw-flex tw-flex-row tw-items-center">
                  <span
                    className={styles.headerText}
                    data-action-id="header-link-bitocracy"
                  >
                    {t(translations.mainMenu.bitocracy)}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} size="xs" />
                </span>
              </NavPopover>
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
              data-action-id="header-link-deposit"
            >
              {t(translations.common.deposit)}
            </Link>
          </li>
          <li className="2xl:tw-mr-4">
            <WalletConnector />
          </li>
          <li className="2xl:tw-mr-4">
            <LanguageToggle />
          </li>
        </Menu>
      </div>
    </header>
  );
};
