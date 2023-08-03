import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Input } from '../../../../components/Form/Input';
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

  const invalidAddress = useMemo(
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
    const isValidBtcAddress = validate(address);

    if (isValidBtcAddress) {
      const { type, network } = getAddressInfo(address);
      const isNetworkValid =
        network.toLowerCase() === currentNetwork.toLowerCase();
      const isTypeValid = type.toLowerCase() !== AddressType.p2tr;

      setAddressValidationState(
        isNetworkValid && isTypeValid
          ? AddressValidationState.VALID
          : AddressValidationState.INVALID,
      );
    } else {
      setAddressValidationState(AddressValidationState.INVALID);
    }
  }, []);

  useEffect(() => {
    if (value && value !== '') {
      setAddressValidationState(AddressValidationState.LOADING);
      validateAddress(value);
    } else {
      setAddressValidationState(AddressValidationState.NONE);
    }
  }, [value, validateAddress]);

  const isSubmitDisabled = useMemo(
    () => invalidAddress || fastBtcLocked || !value || value === '',
    [fastBtcLocked, invalidAddress, value],
  );

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
          {invalidAddress && (
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
            disabled={isSubmitDisabled}
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
