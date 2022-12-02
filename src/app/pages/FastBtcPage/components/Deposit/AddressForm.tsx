import React, { useCallback, useContext } from 'react';
import { DepositDetails } from './DepositDetails';
import { AddressQrCode, URIType } from 'app/components/Form/AddressQrCode';
import { DepositContext } from '../../contexts/deposit-context';
import { FastBtcDirectionType } from '../../types';
import { FastBtcButton } from '../FastBtcButton';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useTransak } from 'app/components/TransakDialog/useTransak';

type AddressFormProps = {
  type: FastBtcDirectionType;
};

export const AddressForm: React.FC<AddressFormProps> = ({ type }) => {
  const { address } = useContext(DepositContext);
  const { t } = useTranslation();
  const { handleClick, isWrongChainId } = useTransak();

  const handleTransakClick = useCallback(() => handleClick('BTC', address), [
    address,
    handleClick,
  ]);

  return (
    <>
      <div className="tw-w-full tw-mb-8">
        <DepositDetails />
        <AddressQrCode
          uri={URIType.BITCOIN}
          address={address}
          hideQr={type === FastBtcDirectionType.TRANSAK}
        />

        {type === FastBtcDirectionType.TRANSAK && (
          <FastBtcButton
            className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
            text={t(translations.fastBtcPage.transak.validationScreen.cta)}
            disabled={isWrongChainId}
            onClick={handleTransakClick}
          />
        )}
      </div>
    </>
  );
};
