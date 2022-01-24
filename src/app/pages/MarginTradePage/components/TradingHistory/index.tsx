import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useAccount } from '../../../../hooks/useAccount';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { backendUrl, currentChainId } from 'utils/classifiers';
import axios from 'axios';
import {
  HistoryTable,
  normalizeEvent,
  calculateProfits,
  ICustomEvent,
  IEventData,
  ICalculatedEvent,
} from './utils';

export const TradingHistory: React.FC = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [eventsHistory, setEventsHistory] = useState<IEventData[]>([]);

  const getHistory = useCallback(() => {
    if (currentChainId) {
      setLoading(true);
      axios
        .get(`${backendUrl[currentChainId]}/events/trade/${account}`)
        .then(({ data }) => {
          setEventsHistory(data.events);
          setLoading(false);
        });
    }
  }, [account]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const [events, setEvents] = useState<ICalculatedEvent[]>([]);

  const mergeEvents = useCallback(() => {
    const items: { [key: string]: ICustomEvent[] } = {};
    if (!loading) {
      eventsHistory.forEach(item => {
        const loanId = item.loanId.toLowerCase();
        if (!items.hasOwnProperty(loanId)) {
          items[loanId] = [];
        }
        item.data.forEach((element: ICustomEvent) => {
          const event = normalizeEvent(element, false);
          if (event !== undefined) {
            items[loanId].push(event);
          }
        });
      });
    }

    const entries = Object.entries(items);
    const closeEntries: ICalculatedEvent[] = [];
    entries.forEach(([, events]) => {
      // exclude entries that does not have sell events
      if (events.filter(item => item.type === 'sell').length > 0) {
        const calculation = calculateProfits(events);
        if (calculation) {
          closeEntries.push(calculation);
        }
      }
    });
    const sortedEntries = closeEntries.sort(function (a, b) {
      return b.time - a.time;
    });
    setEvents(sortedEntries);
  }, [eventsHistory, loading]);

  useEffect(() => {
    if (account && eventsHistory) {
      mergeEvents();
    }
  }, [account, eventsHistory, mergeEvents]);

  if (loading && !events.length) {
    return <SkeletonRow />;
  }

  if (!loading && !events.length) {
    return (
      <div className="tw-p-4">
        {t(translations.tradingHistoryPage.noClosedTrades)}
      </div>
    );
  }

  return (
    <>
      <HistoryTable items={events} />
    </>
  );
};
