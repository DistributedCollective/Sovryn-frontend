import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Input } from '../../../../components/Form/Input';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { ErrorBadge } from '../../../../components/Form/ErrorBadge';
import { FastBtcButton } from '../FastBtcButton';
import {
  validate,
  getAddressInfo,
  AddressType,
} from 'bitcoin-address-validation';
import { currentNetwork } from 'utils/classifiers';

enum AddressValidationState {
  NONE,
  LOADING,
  VALID,
  INVALID,
}

export const AddressForm: React.FC = () => {
  const { address, set } = useContext(WithdrawContext);
  const { t } = useTranslation();

  const [addressValidationState, setAddressValidationState] = useState(
    AddressValidationState.NONE,
  );
  const [value, setValue] = useState(address);

  const invalid = useMemo(
    () => addressValidationState === AddressValidationState.INVALID,
    [addressValidationState],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        address: value,
        step: WithdrawStep.REVIEW,
      })),
    [set, value],
  );

  const validateAddress = useCallback(async (address: string) => {
    setAddressValidationState(AddressValidationState.LOADING);
    let isValid = false;
    const isValidBtcAddress = validate(address);
    isValid = await contractReader.call('fastBtcBridge', 'isValidBtcAddress', [
      address,
    ]);
    if (isValidBtcAddress && isValid) {
      const result = getAddressInfo(address);
      if (
        result.network.toLowerCase() === currentNetwork.toLowerCase() &&
        result.type.toLowerCase() !== AddressType.p2tr
      ) {
        isValid = true;
      }
    }

    setAddressValidationState(
      isValid ? AddressValidationState.VALID : AddressValidationState.INVALID,
    );
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedOnChange = useCallback(
    debounce(adr => validateAddress(adr), 300),
    [validateAddress],
  );

  useEffect(() => {
    if (value) {
      setAddressValidationState(AddressValidationState.NONE);
      delayedOnChange(value);
    }
  }, [delayedOnChange, value]);

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        {t(translations.fastBtcPage.withdraw.addressForm.title)}
      </div>

      <div className="tw-w-full">
        <FormGroup
          label={t(translations.fastBtcPage.withdraw.addressForm.address)}
        >
          <Input onChange={setValue} value={value} className="tw-max-w-none" />
          {invalid && (
            <ErrorBadge
              content={t(
                translations.fastBtcPage.withdraw.addressForm.errorBECH32,
              )}
            />
          )}
        </FormGroup>

        <div className="tw-px-8 tw-mt-8">
          <FastBtcButton
            text={t(translations.fastBtcPage.withdraw.addressForm.cta)}
            onClick={onContinueClick}
            disabled={addressValidationState !== AddressValidationState.VALID}
            loading={addressValidationState === AddressValidationState.LOADING}
          />
        </div>
      </div>
    </>
  );
};
