import { useMemo } from 'react';
import { TradingPair } from 'utils/models/trading-pair';
import { TradingPosition } from 'types/trading-position';
import { Asset } from 'types/asset';

interface PairTokensResponse {
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  useCollateralTokens: boolean;
}

export function useTrading_resolvePairTokens(
  pair: TradingPair,
  position: TradingPosition,
  collateral: Asset,
): PairTokensResponse {
  const loanToken = useMemo(() => pair.getAssetForPosition(position), [
    pair,
    position,
  ]);
  const collateralToken = useMemo(() => {
    if (loanToken === collateral) {
      return position === TradingPosition.LONG
        ? pair.shortAsset
        : pair.longAsset;
    }
    return collateral;
  }, [pair, position, collateral, loanToken]);

  return {
    loanToken,
    collateralToken,
    useLoanTokens: loanToken === collateral,
    useCollateralTokens: loanToken !== collateral,
  };
}

// export function useTrading_resolvePairTokens(
//   pair: TradingPair,
//   position: TradingPosition,
//   lendingContract: Asset,
//   token: Asset,
// ): PairTokensResponse {
//   const getLendingToken = useCallback(() => {
//     if (
//       TradingPairDictionary.longPositionTokens.includes(lendingContract) &&
//       TradingPairDictionary.longPositionTokens.includes(token)
//     ) {
//       return token;
//     }
//     return lendingContract;
//   }, [lendingContract, token]);
//
//   const getToken = useCallback(() => {
//     if (getLendingToken() === token) {
//       return position === TradingPosition.LONG
//         ? pair.getShortAsset()
//         : pair.getLongAsset();
//     }
//     return token;
//   }, [getLendingToken, token, pair, position]);
//
//   const [loanToken, setLoanToken] = useState(getLendingToken());
//   const [collateralToken, setCollateralToken] = useState(getToken());
//
//   useEffect(() => {
//     setLoanToken(getLendingToken());
//   }, [lendingContract, token, getLendingToken]);
//
//   useEffect(() => {
//     setCollateralToken(getToken());
//   }, [getLendingToken, getToken, token, pair, position]);
//
//   return {
//     loanToken,
//     collateralToken,
//     useLoanTokens: loanToken === token,
//     useCollateralTokens: loanToken !== token,
//   };
// }
