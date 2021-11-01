import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

/**
 * Hook to return candlesticks for chart
 * Takes as input:
 * 1. PerpetualId
 * 2. Candle duration
 * 3. Start time
 *
 * Returns as output:
 * open, high, low, close, volume, startTime
 */

enum CandleDuration {
  M_10 = 'M_10',
  M_30 = 'M_30',
}
