import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';

enum AddressValidationState {
  NONE,
  LOADING,
  VALID,
  INVALID,
}

export const AddressForm: React.FC = () => {
  const { address, set } = useContext(WithdrawContext);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

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
    let result = false;
    const isValidBtcAddress = validate(address);
    const isValid = await contractReader.call(
      'fastBtcBridge',
      'isValidBtcAddress',
      [address],
    );
    if (isValidBtcAddress && isValid) {
      const { network, type } = getAddressInfo(address);
      if (
        network.toLowerCase() === currentNetwork.toLowerCase() &&
        type.toLowerCase() !== AddressType.p2tr
      ) {
        result = true;
      }
    }

    setAddressValidationState(
      result ? AddressValidationState.VALID : AddressValidationState.INVALID,
    );
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedOnChange = useCallback(
    debounce(addressToValidate => validateAddress(addressToValidate), 300),
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
      <div className="tw-mb-10 tw-text-base tw-text-center tw-font-semibold">
        {t(translations.fastBtcPage.withdraw.addressForm.title)}
      </div>

      <div className="tw-w-full tw-max-w-80 tw-mx-auto tw-mb-36">
        <FormGroup
          label={t(translations.fastBtcPage.withdraw.addressForm.address)}
          labelClassName="tw-text-sm tw-font-semibold"
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

        <div className="tw-px-8 tw-mt-8 tw-text-center">
          <FastBtcButton
            className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
            text={t(translations.fastBtcPage.withdraw.addressForm.cta)}
            onClick={onContinueClick}
            disabled={
              addressValidationState !== AddressValidationState.VALID ||
              fastBtcLocked
            }
            loading={addressValidationState === AddressValidationState.LOADING}
          />
          {fastBtcLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.fastBTC}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
