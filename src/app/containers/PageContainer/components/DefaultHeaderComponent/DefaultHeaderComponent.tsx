import {
  Popover,
  PopoverInteractionKind,
  PopoverPosition,
  Position,
} from '@blueprintjs/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { useAccount, useIsConnected } from 'app/hooks/useAccount';

import WalletConnector from '../../../WalletConnector';
import { lendBorrowSovrynSaga } from '../../../../pages/BorrowPage/saga';
import {
  reducer as lendBorrowReducer,
  sliceKey as lendBorrowSlice,
} from '../../../../pages/BorrowPage/slice';
import { LanguageToggle } from '../../../../components/LanguageToggle';
import styles from './index.module.scss';
import { ReactComponent as SovLogo } from 'assets/images/sovryn-logo-alpha.svg';
import { D2_URL, bitocracyUrl, myntUrl } from 'utils/classifiers';
import { Menu } from 'app/components/Menu';
import { MenuItem } from 'app/components/Menu/components/MenuItem';
import { MenuSeparator } from 'app/components/Menu/components/MenuSeparator';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonStyle,
  ButtonType,
} from 'app/components/Button';
import { Sovryn } from 'utils/sovryn';
import { bignumber } from 'mathjs';

import { ReactComponent as AppsIcon } from 'assets/apps-icon.svg';

type PagesProps = {
  to: string;
  title: string;
  dataActionId: string;
  hrefExternal?: boolean;
  disabled?: boolean;
  bold?: boolean;
};

export const DefaultHeaderComponent: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const node = useRef(null);
  const connected = useIsConnected();
  const account = useAccount();

  const [rbtcBalance, setRbtcBalance] = useState('0');

  useEffect(() => {
    if (account) {
      Sovryn.getWeb3()
        .eth.getBalance(account)
        .then(setRbtcBalance)
        .catch(e => console.log('Could not load RBTC balance'));
    }
  }, [account]);

  const hasFunds = useMemo(
    () => !bignumber(rbtcBalance).isZero() && connected,
    [connected, rbtcBalance],
  );

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

  const labPages: PagesProps[] = [
    {
      to: '/origins',
      title: t(translations.mainMenu.originsLaunchpad),
      dataActionId: 'header-mobile-lab-link-launchpad',
    },
    {
      to: '/origins/claim',
      title: t(translations.mainMenu.originsClaim),
      dataActionId: 'header-mobile-lab-link-claim',
    },
    {
      to: myntUrl,
      title: t(translations.mainMenu.myntToken),
      dataActionId: 'header-mobile-lab-link-mynt-token',
      disabled: true,
    },
  ];

  const pages: PagesProps[] = [
    {
      to: '',
      title: t(translations.mainMenu.trade),
      dataActionId: 'header-link-trade',
    },
    {
      to: '/swap',
      title: t(translations.mainMenu.swap),
      dataActionId: 'header-mobile-trade-link-swap',
    },
    {
      to: '/spot',
      title: t(translations.mainMenu.spotTrade),
      dataActionId: 'header-mobile-trade-link-spot',
    },
    {
      to: '/trade',
      title: t(translations.mainMenu.marginTrade),
      dataActionId: 'header-mobile-trade-link-margin',
    },
    {
      to: '',
      title: '',
      dataActionId: '',
    },
    {
      to: '/borrow',
      title: t(translations.mainMenu.borrow),
      dataActionId: 'header-mobile-link-borrow',
    },
    {
      to: '',
      title: t(translations.mainMenu.earn),
      dataActionId: 'header-mobile-link-earn',
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
      dataActionId: 'header-mobile-earn-link-lend',
    },
    {
      to: '/yield-farm',
      title: t(translations.mainMenu.pool),
      dataActionId: 'header-mobile-earn-link-pool',
    },
    {
      to: '/stake',
      title: t(translations.mainMenu.staking),
      dataActionId: 'header-mobile-earn-link-stake',
    },
    {
      to: '',
      title: t(translations.mainMenu.labs),
      dataActionId: 'header-mobile-link-lab',
    },
    ...labPages,
    {
      to: '',
      title: t(translations.mainMenu.bitocracy),
      dataActionId: 'header-mobile-link-bitocracy',
    },
    {
      to: bitocracyUrl,
      title: t(translations.mainMenu.voting),
      dataActionId: 'header-mobile-bitocracy-link-voting',
      hrefExternal: true,
    },
    {
      to: 'https://forum.sovryn.app',
      title: t(translations.mainMenu.forum),
      dataActionId: 'header-mobile-bitocracy-link-forum',
      hrefExternal: true,
    },
    {
      to: '',
      title: t(translations.mainMenu.d2Title),
      dataActionId: '',
      hrefExternal: true,
    },
    {
      to: `${D2_URL}/borrow/line-of-credit`,
      title: t(translations.mainMenu.borrow),
      dataActionId: 'header-mobile-d2-link-borrow',
      hrefExternal: true,
      bold: true,
    },
    {
      to: `${D2_URL}/earn`,
      title: t(translations.mainMenu.earn),
      dataActionId: 'header-mobile-d2-link-earn',
      hrefExternal: true,
      bold: true,
    },
    {
      to: `${D2_URL}/convert`,
      title: t(translations.mainMenu.convert),
      dataActionId: 'header-mobile-d2-link-convert',
      hrefExternal: true,
      bold: true,
    },
    {
      to: '',
      title: '',
      dataActionId: '',
    },
    {
      to: '/rewards',
      title: t(translations.mainMenu.reward),
      dataActionId: 'header-mobile-link-rewards',
    },
    {
      to: '/wallet',
      title: t(translations.mainMenu.portfolio),
      dataActionId: 'header-mobile-link-portfolio',
    },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
      dataActionId: 'header-mobile-link-help',
      hrefExternal: true,
    },
  ];

  const menuItems = pages.map((item, index) => {
    let link: PagesProps = item;

    if (link.to === '') {
      return <MenuSeparator key={index} text={link.title} />;
    }
    return (
      <MenuItem
        key={index}
        href={link.to}
        text={link.title}
        onClick={() => {
          if (!link.hrefExternal) {
            history.push(link.to);
          }
          setOpen(false);
        }}
        hrefExternal={link.hrefExternal}
        data-action-id={link.dataActionId}
        disabled={link.disabled || false}
        className={classNames('tw-leading-snug', {
          'tw-font-bold': link.bold,
        })}
      />
    );
  });

  const NavPopover = ({ content, children }) => {
    return (
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        minimal={true}
        popoverClassName={styles.headerNavPopover}
        content={content}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        position={Position.BOTTOM_LEFT}
        className="hover:tw-bg-gray-2.5 tw-rounded tw-text-gray-8 hover:tw-text-sov-white tw-cursor-pointer"
      >
        {children}
      </Popover>
    );
  };

  const SECTION_TYPE = {
    PRODUCTS: 'products',
    TRADE: 'trade',
    EARN: 'earn',
    LABS: 'labs',
    BORROW: 'borrow',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/swap', '/spot', '/trade'],
      [SECTION_TYPE.EARN]: ['/lend', '/yield-farm', '/stake'],
      [SECTION_TYPE.LABS]: [
        '/origins',
        '/origins/claim',
        '/labs',
        '/zero',
        '/mynt-token',
      ],
      [SECTION_TYPE.BORROW]: ['/borrow'],
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
                    <MenuSeparator text={t(translations.mainMenu.d2Title)} />
                    <MenuItem
                      text={t(translations.mainMenu.borrow)}
                      label={t(translations.mainMenu.labels.d2Borrow)}
                      href={`${D2_URL}/borrow/line-of-credit`}
                      hrefExternal
                      dataActionId="header-trade-d2-link-borrow"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.earn)}
                      label={t(translations.mainMenu.labels.d2Earn)}
                      href={`${D2_URL}/earn`}
                      hrefExternal
                      dataActionId="header-trade-d2-link-earn"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.convert)}
                      label={t(translations.mainMenu.labels.d2Convert)}
                      href={`${D2_URL}/convert`}
                      hrefExternal
                      dataActionId="header-trade-d2-link-convert"
                    />
                  </>
                }
              >
                <span className={classNames(styles.firstLevelMenu)}>
                  <AppsIcon />
                </span>
              </NavPopover>
              <NavPopover
                content={
                  <>
                    <MenuItem
                      text={t(translations.mainMenu.swap)}
                      label={t(translations.mainMenu.labels.swap)}
                      href="/swap"
                      dataActionId="header-trade-link-swap"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.spotTrade)}
                      label={t(translations.mainMenu.labels.spotTrade)}
                      href="/spot"
                      dataActionId="header-trade-link-spot"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.marginTrade)}
                      label={t(translations.mainMenu.labels.marginTrade)}
                      href="/trade"
                      dataActionId="header-trade-link-margin"
                    />
                  </>
                }
              >
                <span
                  className={classNames(styles.firstLevelMenu, {
                    [styles.firstLevelMenuActive]: isSectionOpen(
                      SECTION_TYPE.TRADE,
                    ),
                  })}
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
                  isSectionOpen(SECTION_TYPE.BORROW)
                    ? 'tw-text-sov-white'
                    : 'tw-text-gray-8',
                  {
                    [styles.firstLevelMenuActive]: isSectionOpen(
                      SECTION_TYPE.BORROW,
                    ),
                  },
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
                      label={t(translations.mainMenu.labels.lend)}
                      href="/lend"
                      dataActionId="header-earn-link-lend"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.pool)}
                      label={t(translations.mainMenu.labels.pool)}
                      href="/yield-farm"
                      dataActionId="header-earn-link-pool"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.staking)}
                      label={t(translations.mainMenu.labels.staking)}
                      href="/stake"
                      dataActionId="header-earn-link-stake"
                    />
                  </>
                }
              >
                <div
                  className={classNames(styles.firstLevelMenu, {
                    [styles.firstLevelMenuActive]: isSectionOpen(
                      SECTION_TYPE.EARN,
                    ),
                  })}
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
                      label={t(translations.mainMenu.labels.originsLaunchpad)}
                      href="/origins"
                      dataActionId="header-lab-link-launchpad"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.originsClaim)}
                      label={t(translations.mainMenu.labels.originsClaim)}
                      href="/origins/claim"
                      dataActionId="header-lab-link-claim"
                    />
                    <MenuItem
                      text={t(translations.mainMenu.myntToken)}
                      label={t(translations.mainMenu.labels.myntToken)}
                      href={myntUrl}
                      hrefExternal
                      disabled
                      dataActionId="header-lab-link-mynt-token"
                    />
                  </>
                }
              >
                <div
                  className={classNames(styles.firstLevelMenu, {
                    [styles.firstLevelMenuActive]: isSectionOpen(
                      SECTION_TYPE.LABS,
                    ),
                  })}
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
                      label={t(translations.mainMenu.labels.voting)}
                      dataActionId="header-bitocracy-link-voting"
                    />
                    <MenuItem
                      href="https://forum.sovryn.app/"
                      hrefExternal
                      text={t(translations.mainMenu.forum)}
                      label={t(translations.mainMenu.labels.forum)}
                      dataActionId="header-bitocracy-link-forum"
                    />
                  </Menu>
                }
              >
                <span className={styles.firstLevelMenu}>
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
          <li className="tw-mr-2 2xl:tw-mr-8">
            <Popover
              interactionKind={PopoverInteractionKind.HOVER}
              position={PopoverPosition.BOTTOM}
              className="tw-pl-4"
              popoverClassName="tw-mw-340"
              disabled={!connected}
              content={
                <div className="tw-px-3.5 tw-py-2 tw-font-normal">
                  <div className="tw-mb-6">
                    {t(translations.mainMenu.tooltips.fundWalletButton)}
                  </div>
                  <a
                    href="https://wiki.sovryn.app/en/getting-started"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(translations.mainMenu.tooltips.readMore)}
                  </a>
                </div>
              }
            >
              <Button
                text={t(
                  translations.mainMenu[hasFunds ? 'fundWallet' : 'getStarted'],
                )}
                onClick={() => history.push('/rbtc')}
                type={ButtonType.button}
                color={ButtonColor.primary}
                style={ButtonStyle.normal}
                size={ButtonSize.md}
                disabled={!connected}
                className="tw-rounded tw-px-5 tw-text-sm"
                dataActionId="header-link-deposit"
              />
            </Popover>
          </li>
          <li className="tw-mr-2 2xl:tw-mr-4">
            <WalletConnector />
          </li>
          <li className="tw-mr-2 2xl:tw-mr-4">
            <LanguageToggle />
          </li>
        </Menu>
      </div>
    </header>
  );
};
