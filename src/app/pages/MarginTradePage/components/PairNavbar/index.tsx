import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { reactLocalStorage } from 'reactjs-localstorage';
import { NotificationSettingsDialog } from 'app/pages/MarginTradePage/components/NotificationSettingsDialog';
import { PairStats } from './PairStats';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import imgNotificationBell from 'assets/images/marginTrade/notifications.svg';
import { IPairsData } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { useIsConnected } from 'app/hooks/useAccount';
import { useDispatch } from 'react-redux';
import { actions } from '../../slice';

export const PairNavbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>() as any;
  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const url = backendUrl[currentChainId];
  const connected = useIsConnected();
  const isPairSelected = reactLocalStorage.getObject('selectedPair');

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/trade':
        return 'trade-pairs';
      default:
        return '';
    }
  };

  const onNotificationSettingsClick = useCallback(
    () => setShowNotificationSettingsModal(true),
    [],
  );

  const [pair, setPair] = useState([]) as any;

  //getting PAIRS DATA
  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();
    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/api/v1/trading-pairs/summary/', {
        params: {
          extra: true,
        },
        cancelToken,
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, [url, setPairsData]);

  useEffect(() => {
    getPairsData();
  }, [getPairsData]);

  const list = useMemo(() => {
    if (!pairsData) return [];
    return Object.keys(pairsData.pairs)
      .map(key => pairsData.pairs[key])
      .filter(pair => pair);
  }, [pairsData]);

  useEffect(() => {
    if (list)
      // set SOV_RBTC by default
      for (let item of list) {
        if (item.trading_pairs === TradingPairType.SOV_RBTC)
          setPair([item, item]);
      }
  }, [list]);

  const onPairChange = useCallback(pair => {
    setPair(pair);
    if (pair[1] !== pair[0])
      reactLocalStorage.setObject('selectedPair', [
        pair[0].base_symbol,
        pair[1].base_symbol,
      ]);
    //filtering pairs for RBTC as target
    if (pair[0].base_symbol === pair[1].base_symbol && !pair[2])
      reactLocalStorage.setObject('selectedPair', [
        pair[0].base_symbol,
        pair[1].quote_symbol,
      ]);
    //filtering pairs for RBTC as source
    if (pair[0].base_symbol === pair[1].base_symbol && pair[2])
      reactLocalStorage.setObject('selectedPair', [
        pair[0].quote_symbol,
        pair[1].base_symbol,
        pair[2],
      ]);

    reactLocalStorage.setObject('selectedPairStat', [
      pair[0].trading_pairs,
      pair[1].trading_pairs,
    ]);
  }, []);

  useEffect(() => {
    if (Object.keys(isPairSelected).length)
      dispatch(
        actions.setPairType(
          TradingPairType[isPairSelected[0] + '_' + isPairSelected[1]],
        ),
      );
  }, [dispatch, isPairSelected]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container twm-mr-2">
        <PairSelect
          storageKey={getStorageKey()}
          onPairChange={onPairChange}
          pairsData={pairsData}
        />

        {pair.length && !pairsLoading && <PairStats pair={pair} />}
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
