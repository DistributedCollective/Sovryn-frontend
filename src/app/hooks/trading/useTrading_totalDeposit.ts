import { useCallback, useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { Asset } from 'types/asset';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

export function useTrading_totalDeposit(
  loanToken: Asset,
  collateralToken: Asset,
  collateralTokenSent: string,
  loanTokenSent: string,
) {
  const [totalDeposit, setTotalDeposit] = useState(loanTokenSent);

  const getOracleRate = useCallback(async () => {
    return ((await contractReader.call('priceFeed', 'queryRate', [
      getTokenContract(collateralToken).address,
      getTokenContract(loanToken).address,
    ])) as unknown) as { rate: string; precision: string };
  }, [collateralToken, loanToken]);

  const getSwapExpectedReturn = useCallback(
    async (loanTokenAmount: string) => {
      return await contractReader.call(
        'sovrynProtocol',
        'getSwapExpectedReturn',
        [
          getTokenContract(loanToken).address,
          getTokenContract(collateralToken).address,
          loanTokenAmount,
        ],
      );
    },
    [collateralToken, loanToken],
  );

  useEffect(() => {
    if (collateralTokenSent !== '0') {
      //get the oracle rate from collateral -> loan
      getOracleRate()
        .then(async ({ rate, precision }) => {
          // compute the loan token amount with the oracle rate
          let loanTokenAmount = bignumber(collateralTokenSent)
            .mul(rate)
            .div(precision)
            .toFixed(0);
          // see how many collateralTokens we would get if exchanging this amount of loan tokens to collateral tokens
          const collateralTokenAmount = (await getSwapExpectedReturn(
            loanTokenAmount,
          )) as string;
          //probably not the same due to the price difference
          if (collateralTokenAmount !== collateralTokenSent) {
            //scale the loan token amount accordingly, so we'll get the expected position size in the end
            loanTokenAmount = bignumber(loanTokenAmount)
              .mul(collateralTokenAmount)
              .div(collateralTokenSent)
              .toFixed(0);
          }
          setTotalDeposit(totalDeposit =>
            bignumber(loanTokenAmount).add(totalDeposit).toFixed(0),
          );
        })
        .catch(console.error);
    } else {
      setTotalDeposit(loanTokenSent);
    }
  }, [
    loanToken,
    collateralToken,
    collateralTokenSent,
    loanTokenSent,
    getOracleRate,
    getSwapExpectedReturn,
  ]);

  return totalDeposit;
}
