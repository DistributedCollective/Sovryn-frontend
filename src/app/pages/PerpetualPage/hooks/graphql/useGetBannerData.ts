import { useQuery, gql } from '@apollo/client';

/** Hook to return data needed for the top banner
 * Takes perpetualId as parameter
 * Currently, this hook returns:
 * - Most recent Mark Price
 * - All candlestick hour volume for the last 24 hours (max 24 candles). This will need to be totalled to give 24 hour trade volume
 */

export function useGetBannerData(perpetualId: string) {
  const candleStickStart = new Date().getTime() / 1000;
  const BANNER_QUERY = gql`
    {
      updateMarkPrices(
        where: {
          perpetualId: "${perpetualId}"
        }
        orderBy: blockTimestamp
        orderDirection: desc
        first: 1
      ) {
        fMarkPricePremium
        fSpotIndexPrice
      }
      candleSticksHours(
        where: {
          perpetualId: "${perpetualId}"
          periodStartUnix_gt: ${candleStickStart}
        }
      ) {
        totalVolume
      }
    }
  `;
  const bannerQuery = useQuery(BANNER_QUERY);
  return bannerQuery;
}
