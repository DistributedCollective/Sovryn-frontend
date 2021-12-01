/**
 * Hook for getting a users past events from the graph
 * 1. Take as parameter an array of events (eg Trade) and user address
 * 2. Eventually paginate this
 */

import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

export function useGetTraderEvents(event: Event[], user: string) {
  const SUBGRAPH_QUERY = generateQuery(event, user);
  const query = useQuery(SUBGRAPH_QUERY);
  return query;
}

function generateQuery(events: Event[], user: string): DocumentNode {
  const arr = events.map(event => {
    const eventDetails = EventDictionary.get(event);
    return `${eventDetails.entityName} { ${eventDetails.fields.toString()} }`;
  });
  // const arr = ['trades { tradeAmount }'];
  return gql`
  { trader(id: "${user}")
  {
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
}

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
    ],
  );
  public static get(event: Event): EventDetails {
    return this.events.get(event) as EventDetails;
  }
}
