import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Input } from 'form/Input';
import { FormGroup } from 'form/FormGroup';
import { Button } from 'form/Button';
import { toastError, toastSuccess } from 'utils/toaster';
import type { SubscriptionForm } from './types';
import { validateEmail } from '../../../../../utils/helpers';
import { translations } from '../../../../../locales/i18n';
import { backendUrl, currentChainId } from '../../../../../utils/classifiers';

interface Props {
  campaign?: string;
}

export function EmailSubscriptionForm(props: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SubscriptionForm>({
    email: '',
    name: '',
  });

  const valid = useMemo(() => validateEmail(form.email) && form.name, [form]);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event && event.preventDefault && event.preventDefault();
      setLoading(true);
      axios
        .post(backendUrl[currentChainId] + '/user/email', {
          ...form,
          url: props?.campaign,
        })
        .then(e => {
          console.log(e);
          toastSuccess(t(translations.emailSubscriptionForm.success));
          setLoading(false);
          setForm({ email: '', name: '' });
        })
        .catch(e => {
          console.error(e);
          setLoading(false);
          toastError(e.message);
        });
    },
    [form, props, t],
  );

  const updateForm = useCallback((field: string, value: string) => {
    setForm(prevState => ({ ...prevState, [field]: value }));
  }, []);

  return (
    <div className="tw-bg-dark tw-rounded-lg tw-p-4">
      <form onSubmit={onSubmit}>
        <FormGroup label={t(translations.emailSubscriptionForm.fields.email)}>
          <Input
            value={form.email}
            onChange={value => updateForm('email', value)}
            type="email"
          />
        </FormGroup>
        <FormGroup label={t(translations.emailSubscriptionForm.fields.name)}>
          <Input
            value={form.name}
            onChange={value => updateForm('name', value)}
            type="text"
          />
        </FormGroup>

        <Button
          text={t(translations.common.submit)}
          type="submit"
          loading={loading}
          disabled={loading || !valid}
        />
      </form>
    </div>
  );
}
