import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useDispatch } from 'react-redux';
import { NotificationSettingsDialog } from 'app/pages/MarginTradePage/components/NotificationSettingsDialog';
import { PairNavbarInfo } from 'app/components/PairNavbarInfo';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import imgNotificationBell from 'assets/images/marginTrade/notifications.svg';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { useIsConnected } from 'app/hooks/useAccount';
import { useGetCryptoPairs } from 'app/hooks/trading/useGetCryptoPairs';
import { actions } from '../../slice';
import { usePairList } from 'app/hooks/trading/usePairList';

export const PairNavbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const connected = useIsConnected();
  const isPairSelected = reactLocalStorage.getObject('selectedMarginPair');

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const getStorageKey = () => {
    if (location.pathname === '/trade') {
      return 'trade-pairs';
    }
    return '';
  };

  const onNotificationSettingsClick = useCallback(
    () => setShowNotificationSettingsModal(true),
    [],
  );

  const [pair, setPair] = useState([]) as any;

  //getting PAIRS DATA
  const pairsData = useGetCryptoPairs();

  const pairsArray = usePairList(pairsData?.pairs);

  useEffect(() => {
    if (pairsArray && !pair.length)
      // set SOV_RBTC by default
      for (let item of pairsArray) {
        if (item.trading_pairs === TradingPairType.SOV_RBTC) {
          setPair([item, item]);
        }
      }
  }, [pairsArray, pair]);

  const onPairChange = useCallback(pair => {
    setPair(pair);
    if (pair[1] !== pair[0]) {
      reactLocalStorage.setObject('selectedMarginPair', [
        pair[0].base_symbol,
        pair[1].base_symbol,
      ]);
    }
    //filtering pairs for RBTC as target
    if (pair[0].base_symbol === pair[1].base_symbol && !pair[2]) {
      reactLocalStorage.setObject('selectedMarginPair', [
        pair[0].base_symbol,
        pair[1].quote_symbol,
      ]);
    }
    //filtering pairs for RBTC as source
    if (pair[0].base_symbol === pair[1].base_symbol && pair[2]) {
      reactLocalStorage.setObject('selectedMarginPair', [
        pair[0].quote_symbol,
        pair[1].base_symbol,
        pair[2],
      ]);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(isPairSelected).length) {
      dispatch(
        actions.setPairType(
          TradingPairType[isPairSelected[0] + '_' + isPairSelected[1]],
        ),
      );
    }
  }, [dispatch, isPairSelected]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container twm-mr-2">
        <PairSelect
          storageKey={getStorageKey()}
          onPairChange={onPairChange}
          pairsData={pairsData}
        />

        {pair && pair.length && <PairNavbarInfo pair={pair} />}
        {connected && (
          <div>
            <button
              onClick={onNotificationSettingsClick}
              className="tw-text-sm tw-text-primary tw-tracking-normal tw-flex tw-items-center"
              data-action-id="margin-select-asset-enable-notification-button"
            >
              <img
                src={imgNotificationBell}
                alt="Notification bell"
                className="tw-mr-1.5"
              />{' '}
              {t(translations.marginTradePage.notificationsButton.enable)}
            </button>
          </div>
        )}
      </div>

      <NotificationSettingsDialog
        isOpen={showNotificationSettingsModal}
        onClose={() => setShowNotificationSettingsModal(false)}
      />
    </div>
  );
};
