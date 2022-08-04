import React, { useContext } from 'react';
import { DepositDetails } from './DepositDetails';
import { AddressQrCode, URIType } from 'app/components/Form/AddressQrCode';
import { DepositContext } from '../../contexts/deposit-context';

export const AddressForm: React.FC = () => {
  const { address } = useContext(DepositContext);

  return (
    <>
      <div className="tw-full tw-mb-8">
        <DepositDetails />
        <AddressQrCode uri={URIType.BITCOIN} address={address} />
      </div>
    </>
  );
};
