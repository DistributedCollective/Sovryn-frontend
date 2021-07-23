import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';
import { VerificationType } from '../types';
import { useGetSaleInformation } from './useGetSaleInformation';

export const useIsAddressVerified = (tierId: number) => {
  const account = useAccount();
  const saleInfo = useGetSaleInformation(tierId);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    contractReader
      .call<boolean>('originsBase', 'isAddressApproved', [account, tierId])
      .then(result => setIsVerified(result));
  }, [account, tierId]);

  if (saleInfo.verificationType === VerificationType.None) {
    return false;
  } else if (saleInfo.verificationType === VerificationType.Everyone) {
    return true;
  }

  return isVerified;
};
