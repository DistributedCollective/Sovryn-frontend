/**
 * Hook for getting a users past events from the graph
 * 1. Take as parameter an array of events (eg Trade) and user address
 * 2. Eventually paginate this
 */

import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useMemo } from 'react';

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

export type EventQuery = {
  event: Event;
  orderBy?: string;
  orderDirection?: OrderDirection;
  page?: number;
  perPage?: number;
  whereCondition?: string;
};

export function useGetTraderEvents(user: string, events: EventQuery[]) {
  const SUBGRAPH_QUERY = useMemo(() => generateQuery(user, events), [
    user,
    events,
  ]);

  const query = useQuery(SUBGRAPH_QUERY);
  return query;
}

function generateQuery(user: string, events: EventQuery[]): DocumentNode {
  const array = events.map(
    ({ event, orderBy, orderDirection, page, perPage, whereCondition }) => {
      const eventDetails = EventDictionary.get(event);

      const isOrdered = orderBy && orderDirection;
      const hasPagination = page && perPage;

      const orderFilterString = isOrdered
        ? `orderBy: ${orderBy}, orderDirection: ${orderDirection}`
        : '';

      const paginationFilterString = hasPagination
        ? `skip: ${(page! - 1) * perPage!} first: ${perPage!}`
        : '';

      const whereConditionString = whereCondition
        ? `where: {${whereCondition}}`
        : '';

      return `${eventDetails.entityName} ${
        isOrdered || hasPagination || whereCondition
          ? `(${orderFilterString} ${paginationFilterString} ${whereConditionString})`
          : ''
      } { ${eventDetails.fields.toString()} }`;
    },
  );

  const totalCountArray = events
    .map(item => totalCountFields[item.event])
    .filter(Boolean)
    .join(' ');

  return gql`
  { trader(id: "${user}")
  {
    ${totalCountArray.toString()}
    ${array.toString()}
  }
}
  `;
}

export enum Event {
  TRADE = 'TRADE',
  TOKENS_DEPOSITED = 'TOKENS_DEPOSITED',
  TOKENS_WITHDRAWN = 'TOKENS_WITHDRAWN',
  LIQUIDATE = 'LIQUIDATE',
  LIQUIDITY_ADDED = 'LIQUIDITY_ADDED',
  LIQUIDITY_REMOVED = 'LIQUIDITY_REMOVED',
  UPDATE_MARGIN_ACCOUNT = 'UPDATE_MARGIN_ACCOUNT',
  POSITION = 'POSITION',
  FUNDING_RATE = 'FUNDING_RATE',
}

const totalCountFields = {
  [Event.TRADE]: 'tradesTotalCount',
  [Event.POSITION]: 'positionsTotalCount',
  [Event.FUNDING_RATE]: 'fundingRatesTotalCount, positionsTotalCount',
};

class EventDetails {
  constructor(public entityName: string, public fields: string[]) {
    this.entityName = entityName;
    this.fields = fields;
  }
}

const genericFields = ['id', 'blockTimestamp', 'transaction { id }'];

class EventDictionary {
  public static events: Map<Event, EventDetails> = new Map<Event, EventDetails>(
    [
      [
        Event.TRADE,
        new EventDetails('trades', [
          'perpetual { id }',
          'tradeAmountBC',
          'newPositionSizeBC',
          'orderFlags',
          'price',
          'limitPrice',
          'isClose',
          ...genericFields,
        ]),
      ],
      [
        Event.TOKENS_DEPOSITED,
        new EventDetails('tokensDeposits', [
          'perpetualId',
          'amount',
          ...genericFields,
        ]),
      ],
      [
        Event.TOKENS_WITHDRAWN,
        new EventDetails('tokensWithdraws', [
          'perpetualId',
          'amount',
          ...genericFields,
        ]),
      ],
      [
        Event.LIQUIDATE,
        new EventDetails('liquidates', [
          'perpetualId',
          'amountLiquidatedBC',
          'newPositionSizeBC',
          'liquidationPrice',
          ...genericFields,
        ]),
      ],
      [
        Event.LIQUIDITY_ADDED,
        new EventDetails('liquidityAddeds', [
          'poolId',
          'tokenAmount',
          'shareAmount',
          ...genericFields,
        ]),
      ],
      [
        Event.LIQUIDITY_REMOVED,
        new EventDetails('liquidityRemoveds', [
          'poolId',
          'tokenAmount',
          'shareAmount',
          ...genericFields,
        ]),
      ],
      [
        Event.UPDATE_MARGIN_ACCOUNT,
        new EventDetails('updateMarginAccount', [
          'id',
          'perpetualId',
          'fPositionBC',
          'fCashCC',
          'fLockedInValueQC',
          'fFundingPaymentCC',
          'fOpenInterestBC',
          'blockTimestamp',
        ]),
      ],
      [
        Event.POSITION,
        new EventDetails('positions', [
          'id',
          'perpetual { id }',
          'currentPositionSizeBC',
          'lowestSizeBC',
          'highestSizeBC',
          'totalPnLCC',
          'endDate',
        ]),
      ],
      [
        Event.FUNDING_RATE,
        new EventDetails('fundingRates', [
          'id',
          'fFundingPaymentCC',
          'rate8h',
          'blockTimestamp',
          'deltaTime',
        ]),
      ],
    ],
  );
  public static get(event: Event): EventDetails {
    return this.events.get(event) as EventDetails;
  }
}
