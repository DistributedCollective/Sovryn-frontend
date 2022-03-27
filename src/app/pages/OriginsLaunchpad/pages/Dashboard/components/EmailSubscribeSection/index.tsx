import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ActionButton } from 'app/components/Form/ActionButton';
import { FieldGroup } from 'app/components/FieldGroup';
import { InputField } from 'app/components/InputField';
import { translations } from 'locales/i18n';
import { toastError, toastSuccess } from 'utils/toaster';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { validateEmail } from 'utils/helpers';
import { SubscriptionForm } from '../../../../components/EmailSubscribeSection/types';

export const EmailSubscribeSection: React.FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SubscriptionForm>({
    email: '',
    name: '',
  });

  const valid = useMemo(() => validateEmail(form.email) && form.name, [form]);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    axios
      .post(backendUrl[currentChainId] + '/user/email', {
        ...form,
        url: 'origins',
      })
      .then(e => {
        toastSuccess(
          t(translations.originsLaunchpad.upcomingSales.submitSuccess),
        );
        setLoading(false);
        setForm({ email: '', name: '' });
      })
      .catch(e => {
        setLoading(false);
        toastError(e.message);
      });
  }, [form, t]);

  const updateForm = useCallback((field: string, value: string) => {
    setForm(prevState => ({ ...prevState, [field]: value }));
  }, []);

  return (
    <div className="tw-max-w-84 tw-mx-auto">
      <FieldGroup
        label={`${t(translations.originsLaunchpad.upcomingSales.inputLabel)}:`}
        className="tw-text-sm tw-tracking-normal tw-font-extralight"
      >
        <InputField
          type="email"
          onChange={event => updateForm('email', event.target.value)}
          value={form.email}
          isOnDarkBackground={true}
          inputClassName="tw-text-black"
        />
      </FieldGroup>

      <FieldGroup
        label={`${t(
          translations.originsLaunchpad.upcomingSales.inputLabelName,
        )}:`}
        className="tw-text-sm tw-tracking-normal tw-font-extralight"
      >
        <InputField
          onChange={event => updateForm('name', event.target.value)}
          value={form.name}
          isOnDarkBackground={true}
          inputClassName="tw-text-black"
        />
      </FieldGroup>

      <ActionButton
        text={t(translations.originsLaunchpad.upcomingSales.submitButton)}
        onClick={handleSubmit}
        disabled={!valid || loading}
        loading={loading}
        className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-xl tw-bg-gray-1 tw-bg-opacity-10"
        textClassName="tw-text-lg tw-tracking-normal tw-leading-snug"
      />
    </div>
  );
};
