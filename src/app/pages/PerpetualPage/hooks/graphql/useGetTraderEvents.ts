/**
 * Hook for getting a users past events from the graph
 * 1. Take as parameter an array of events (eg Trade) and user address
 * 2. Eventually paginate this
 */

import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

export function useGetTraderEvents(event: Event[], user: string) {
  console.debug('Geting events tab');
  const SUBGRAPH_QUERY = generateQuery(
    event,
    '0xaaa5a190accbc50f4f9c130b5876521e4d5f9d6c',
  );
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
}

class EventDetails {
  constructor(
    public entityName: string,
    public fields: string[],
    public userField: string,
  ) {
    this.entityName = entityName;
    this.fields = fields;
    this.userField = userField;
  }
}

const genericFields = ['blockTimestamp', 'transaction { id }'];

class EventDictionary {
  public static events: Map<Event, EventDetails> = new Map<Event, EventDetails>(
    [
      [
        Event.TRADE,
        new EventDetails(
          'trades',
          ['perpetualId', 'tradeAmount', 'price', ...genericFields],
          'trader',
        ),
      ],
      [
        Event.TOKENS_DEPOSITED,
        new EventDetails(
          'tokensDeposits',
          ['perpetualId', 'amount', ...genericFields],
          'trader',
        ),
      ],
    ],
  );
  public static get(event: Event): EventDetails {
    return this.events.get(event) as EventDetails;
  }
}
