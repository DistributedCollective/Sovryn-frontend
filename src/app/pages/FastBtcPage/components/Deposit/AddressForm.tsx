import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DepositDetails } from './DepositDetails';
import { AddressQrCode, URIType } from 'app/components/Form/AddressQrCode';
import { DepositContext } from '../../contexts/deposit-context';

export const AddressForm: React.FC = () => {
  const { address } = useContext(DepositContext);
  const { t } = useTranslation();

  return (
    <>
      <div className="tw-mb-6 tw-text-base tw-text-center tw-font-semibold">
        {t(translations.fastBtcPage.deposit.addressForm.title)}
      </div>
      <div className="tw-full">
        <DepositDetails />
        <AddressQrCode uri={URIType.BITCOIN} address={address} />
      </div>
    </>
  );
};
