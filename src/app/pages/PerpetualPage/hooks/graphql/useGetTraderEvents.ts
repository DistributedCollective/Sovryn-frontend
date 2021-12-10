/**
 * Hook for getting a users past events from the graph
 * 1. Take as parameter an array of events (eg Trade) and user address
 * 2. Eventually paginate this
 */

import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

export function useGetTraderEvents(
  event: Event[],
  user: string,
  orderBy?: string,
  orderDirection?: OrderDirection,
  page?: number,
  perPage?: number,
  whereCondition?: string,
) {
  const SUBGRAPH_QUERY = generateQuery(
    event,
    user,
    orderBy,
    orderDirection,
    page,
    perPage,
    whereCondition,
  );

  const query = useQuery(SUBGRAPH_QUERY);
  return query;
}

function generateQuery(
  events: Event[],
  user: string,
  orderBy?: string,
  orderDirection?: OrderDirection,
  page?: number,
  perPage?: number,
  whereCondition?: string,
): DocumentNode {
  const arr = events.map(event => {
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
  });

  const totalCountArray = events
    .filter(item => !!totalCountFields[item])
    .map(item => `${totalCountFields[item]} `);

  return gql`
  { trader(id: "${user}")
  {
    ${totalCountArray.toString()}
    ${arr.toString()}
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
}

const totalCountFields = {
  [Event.TRADE]: 'tradesTotalCount',
  [Event.POSITION]: 'positionsTotalCount',
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
          'amount',
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
          'currentPositionSizeBC',
          'totalPnLCC',
          'endDate',
        ]),
      ],
    ],
  );
  public static get(event: Event): EventDetails {
    return this.events.get(event) as EventDetails;
  }
}
