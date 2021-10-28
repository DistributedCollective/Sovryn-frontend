/**
 * Hook for getting a users past events from the graph
 * 1. Use the useAccount hook to get the users address
 * 2. Take as parameter the name of the event
 * 3. Eventually paginate this
 */

import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useAccount } from '../useAccount';

export function useGetEvents(event: Event) {
  const { address } = useAccount();
  const SUBGRAPH_QUERY = generateQuery(event);
  const query = useQuery(SUBGRAPH_QUERY);
  return query;
}

function generateQuery(eventName: Event): DocumentNode {
  const eventDetails = EventDictionary.get(eventName);
  /** Get all events where trader is user */
  return gql`
  {
    ${eventDetails.entityName}(
      where: {
        ${eventDetails.userField}: "0xaaa5a190accbc50f4f9c130b5876521e4d5f9d6c"
      }
      first: 5
    ) {
      ${eventDetails.fields.toString()}
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

class EventDictionary {
  public static events: Map<Event, EventDetails> = new Map<Event, EventDetails>(
    [
      [
        Event.TRADE,
        new EventDetails(
          'trades',
          [
            'perpetualId',
            'tradeAmount',
            'price',
            'blockTimestamp',
            'transaction { id }',
          ],
          'trader',
        ),
      ],
    ],
  );
  public static get(event: Event): EventDetails {
    return this.events.get(event) as EventDetails;
  }
}
