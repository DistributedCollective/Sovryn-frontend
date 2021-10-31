import { useEffect, useMemo, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';
import { Asset } from 'types/asset';
import {
  getTokenContractName,
  getTokenContract,
  getContract,
} from 'utils/blockchain/contract-helpers';
// import { bigNum } from 'utils';

const connectorWeight = 400000;
const treasuryAddress = '0x519c6f3364C2c30619a4ad361DF13a7042E958d3';

function useGetTreasuryBalance(asset) {
  useEffect(() => {
    contractReader
      .call<string>(getTokenContractName(asset), 'balanceOf', [treasuryAddress])
      .then(result => {
        console.log('[treasuryBalance]', result);
      });
  }, [asset, getTokenContractName]);
  return 0;
}

export function useBondingCurvePrice(asset, amount, forwards = true) {
  const [totalSupply, setTotalSupply] = useState<string>('0');

  const tokenContract = getTokenContract(asset);
  const [collateral, setCollateral] = useState('0');
  // const treasuryBalance = useGetTreasuryBalance(asset);
  // const antTreasuryBalance = useTokenBalance(asset, treasuryAddress)
  useEffect(() => {
    contractReader
      .call<string>(getTokenContractName(asset), 'totalSupply', [])
      .then(result => {
        console.log('[totalSupply]', result);
        setTotalSupply(result);
      });
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('SOV_token', 'balanceOf', [
        getContract('MYNTReserve').address,
      ])
      .then(result => {
        console.log('[collateral]', result);
      })
      .catch(error => {
        console.log('[collateral][error]', error);
      });
  }, []);

  // useEffect(() => {
  //   contractReader.call<string>('MYNTReserve', 'getRecoveryVault', [])
  //     .then(result => {
  //       console.log('[RecoveryVault]', result);
  //     })
  //     .catch(error => {
  //       console.log('[recoveryVault]', error);
  //     });
  // })

  // useEffect(() => {
  //   contractReader.call<string>('MYNTReserve', 'balance', ['0x0000000000000000000000000000000000000000'])
  //     .then(result => {
  //       console.log('[RecoverVault][Balance]', result);
  //     })
  //     .catch(error => console.log('[recoverbalance]', error));
  // });

  // useEffect(() => {
  //   contractReader.call('BancorFormula', 'calculateSaleReturn', [
  //     totalSupply,
  //     '0',
  //     connectorWeight,
  //     amount,
  //   ])
  //     .then(result => {
  //       console.log('[BondingPrice]', result, amount, totalSupply);
  //     })
  //     .catch(error => {
  //       console.log('[Error]', error)
  //     });
  // }, [totalSupply, amount, connectorWeight, treasuryBalance]);

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(-1);

  // const anjContract = useKnownContract('TOKEN_ANJ')
  // const bancorContract = useKnownContract('BANCOR_FORMULA')

  // const [treasuryAddress] = getKnownContract('BONDING_CURVE_TREASURY')
  // const antTreasuryBalance = useTokenBalance('ANT', treasuryAddress)
  // const connectorWeight = getConnectorWeight()
  // useEffect(() => {
  //   let cancelled = false
  //   let retryTimer

  //   if (!anjContract || antTreasuryBalance.eq(-1) || !bancorContract) {
  //     return
  //   }

  //   const getSalePrice = async () => {
  //     try {
  //       setLoading(true)
  //       const anjTotalSupply = await anjContract.totalSupply()
  //       const salePrice = await (forwards
  //         ? bancorContract.calculatePurchaseReturn(
  //             anjTotalSupply,
  //             antTreasuryBalance,
  //             connectorWeight,
  //             amount
  //           )
  //         : bancorContract.calculateSaleReturn(
  //             anjTotalSupply,
  //             antTreasuryBalance,
  //             connectorWeight,
  //             amount
  //           ))
  //       if (!cancelled) {
  //         setLoading(false)
  //         setPrice(salePrice)
  //       }
  //     } catch (err) {
  //       if (!cancelled) {
  //         retryTimer = setTimeout(getSalePrice, RETRY_EVERY)
  //       }
  //     }
  //   }

  //   getSalePrice()

  //   return () => {
  //     cancelled = true
  //     clearTimeout(retryTimer)
  //   }
  // }, [
  //   amount,
  //   anjContract,
  //   antTreasuryBalance,
  //   bancorContract,
  //   connectorWeight,
  //   forwards,
  // ])

  return useMemo(() => ({ loading, price }), [loading, price]);
}
