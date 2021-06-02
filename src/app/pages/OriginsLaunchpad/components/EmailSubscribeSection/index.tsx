import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../../components/Form/ActionButton/index';
import { FieldGroup } from '../../../../components/FieldGroup';
import { InputField } from '../../../../components/InputField';
import { translations } from '../../../../../locales/i18n';

export const EmailSubscribeSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleSubmit = useCallback(() => console.log(email), [email]);

  return (
    <div className="tw-max-w-20.5rem tw-mx-auto">
      <FieldGroup
        label={`${t(translations.originsLaunchpad.upcomingSales.inputLabel)}:`}
        className="tw-text-sm tw-tracking-normal tw-font-thin"
      >
        <InputField
          type="email"
          onChange={event => setEmail(event.target.value)}
          value={email}
          isOnDarkBackground={true}
          inputClassName="tw-text-black"
        />
      </FieldGroup>

      <ActionButton
        text={t(translations.originsLaunchpad.upcomingSales.submitButton)}
        onClick={handleSubmit}
        className="tw-block tw-w-full tw-h-10 tw-px-9 tw-mt-8 tw-rounded-10px tw-bg-primary tw-bg-opacity-5"
        textClassName="tw-text-lg tw-tracking-normal tw-leading-5.5"
      />
    </div>
  );
};
