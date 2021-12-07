import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { NotificationSettingsDialog } from 'app/pages/MarginTradePage/components/NotificationSettingsDialog';
import { PairStats } from './PairStats';
import { PairSelect } from './PairSelect';
import { useLocation } from 'react-router-dom';
import imgNotificationBell from 'assets/images/marginTrade/notifications.svg';
import { IPairsData } from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { SpotPairType } from '../../types';

export const PairNavbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>() as any;
  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const url = backendUrl[currentChainId];

  const [
    showNotificationSettingsModal,
    setShowNotificationSettingsModal,
  ] = useState(false);

  const getStorageKey = () => {
    switch (location.pathname) {
      case '/spot':
        return 'spot-pairs';
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
      .get(url + '/api/v1/trading-pairs/summary/?extra=true', {
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
      for (let pair of list) {
        if (pair.trading_pairs === SpotPairType.SOV_RBTC) setPair([pair, pair]);
      }
  }, [list]);

  return (
    <div className="tw-bg-gray-3 tw-w-full">
      <div className="tw-flex tw-items-center tw-container twm-mr-2">
        <PairSelect
          storageKey={getStorageKey()}
          onPairChange={pair => setPair(pair)}
          pairsData={pairsData}
        />

        {pair.length > 1 && !pairsLoading && <PairStats pair={pair} />}
        <div>
          <button
            onClick={onNotificationSettingsClick}
            className="tw-text-sm tw-text-primary tw-tracking-normal tw-flex tw-items-center"
          >
            <img
              src={imgNotificationBell}
              alt="Notification bell"
              className="tw-mr-1.5"
            />{' '}
            {t(translations.marginTradePage.notificationsButton.enable)}
          </button>
        </div>
      </div>

      <NotificationSettingsDialog
        isOpen={showNotificationSettingsModal}
        onClose={() => setShowNotificationSettingsModal(false)}
      />
    </div>
  );
};
