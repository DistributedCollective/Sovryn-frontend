import { useEffect, useMemo, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useGetSaleInformation } from 'app/pages/OriginsLaunchpad/hooks/useGetSaleInformation';

const connectorWeight = 400000;

export const useEstimateZeroToSov = (weiAmount: string) => {
  const saleInfo = useGetSaleInformation();
  const [totalSupply, setTotalSupply] = useState('1');
  const [vaultAddress, setVaultAddress] = useState('');
  const [collateral, setCollateral] = useState('0');

  const sovAmount = useMemo(() => {
    if (!saleInfo.isClosed) {
      return bignumber(weiAmount).div(saleInfo.depositRate).toString();
    } else {
      return bignumber(weiAmount)
        .mul(collateral)
        .div(totalSupply)
        .div(connectorWeight)
        .toString();
    }
  }, [saleInfo, totalSupply, collateral, weiAmount]);

  useEffect(() => {
    contractReader
      .call<string>('ZERO_token', 'totalSupply', [])
      .then(result => {
        setTotalSupply(result);
      });
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('ZEROMarketMaker', 'reserve', [])
      .then(result => setVaultAddress(result));
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('SOV_token', 'balanceOf', [vaultAddress])
      .then(result => {
        setCollateral(result);
      })
      .catch(() => {});
  }, [vaultAddress]);

  return sovAmount;
};
