import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { FormGroup } from 'app/components/Form/FormGroup';
import { Input } from '../../../../components/Form/Input';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { ErrorBadge } from '../../../../components/Form/ErrorBadge';
import { FastBtcButton } from '../FastBtcButton';

type AddressValidation = 'none' | 'loading' | 'valid' | 'invalid';

export const AddressForm: React.FC = () => {
  const { address, set } = useContext(WithdrawContext);
  const { t } = useTranslation();

  const [valid, setValid] = useState<AddressValidation>('none');
  const [value, setValue] = useState(address);

  const invalid = useMemo(() => valid === 'invalid', [valid]);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        address: value,
        step: WithdrawStep.REVIEW,
      })),
    [set, value],
  );

  const validate = useCallback(async (adr: string) => {
    setValid('loading');
    const result = await contractReader.call(
      'fastBtcBridge',
      'isValidBtcAddress',
      [adr],
    );
    setValid(result ? 'valid' : 'invalid');
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedOnChange = useCallback(
    debounce(adr => validate(adr), 300),
    [validate],
  );

  const onChange = useCallback(
    (adr: string) => {
      setValue(adr);
      setValid('none');
      delayedOnChange(adr);
    },
    [delayedOnChange],
  );

  return (
    <>
      <div className="tw-mb-6 tw-text-2xl tw-text-center tw-font-semibold">
        {t(translations.fastBtcPage.withdraw.addressForm.title)}
      </div>

      <div className="tw-w-full">
        <FormGroup
          label={t(translations.fastBtcPage.withdraw.addressForm.address)}
        >
          <Input onChange={onChange} value={value} />
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
            disabled={valid !== 'valid'}
          />
        </div>
      </div>
    </>
  );
};
