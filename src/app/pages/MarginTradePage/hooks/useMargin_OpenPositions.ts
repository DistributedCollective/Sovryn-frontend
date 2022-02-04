import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAccount } from 'app/hooks/useAccount';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { OpenLoan } from 'types/active-loan';

const PAGE_SIZE = 6;

type ClosedPositionHookResult = {
  loading: boolean;
  events?: OpenLoan[];
  totalCount: number;
};

export const useMargin_OpenPositions = (
  page: number,
): ClosedPositionHookResult => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [totalCount, setTotalCount] = useState(0);
  const [events, setEvents] = useState<OpenLoan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getOpenLoans = () =>
      axios
        .get(
          url +
            `/events/trade/${account}?page=${page}&pageSize=${PAGE_SIZE}&isOpen=true`,
        )
        .then(({ data }) => {
          setEvents(data.events);
          setTotalCount(data.pagination.totalPages * PAGE_SIZE);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setLoading(false);
        });

    if (account) {
      getOpenLoans();
    }
  }, [account, page, url]);

  return {
    events,
    loading,
    totalCount,
  };
};
