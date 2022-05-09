import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '../../containers/Dialog';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { translations } from '../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { useCookie } from 'app/hooks/useCookie';
import { sovAnalyticsCookie } from 'utils/classifiers';
import { Checkbox } from '../Checkbox';

export interface OptOutProps {
  open: boolean;
  onClose: () => void;
}

export default function OptOutDialog(props: OptOutProps) {
  const { t } = useTranslation();
  const { get, set, clear } = useCookie();
  const [optIn, setOptIn] = useState<boolean>(true);

  const onSubmit = () => {
    if (optIn) clear(sovAnalyticsCookie.name);
    else set(sovAnalyticsCookie.name, sovAnalyticsCookie.value);
    props.onClose();
  };

  useEffect(() => {
    setOptIn(!(get(sovAnalyticsCookie.name) === sovAnalyticsCookie.value));
  }, [get]);

  useEffect(() => {
    if (props.open)
      setOptIn(!(get(sovAnalyticsCookie.name) === sovAnalyticsCookie.value));
  }, [props.open, get]);

  const handleChange = useCallback(() => setOptIn(!!!optIn), [optIn]);

  return (
    <>
      <Dialog isOpen={props.open} onClose={props.onClose}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.analyticsDialog.title)}
          </h1>
          <div className="tw-text-sm tw-font-normal tw-tracking-normal">
            <div className="tw-mb-6">
              {t(translations.analyticsDialog.message_1)}
            </div>
            <FormGroup className="tw-mb-6">
              <Checkbox
                label={t(translations.analyticsDialog.option)}
                checked={optIn}
                onChange={handleChange}
                className="tw-text-sm md:tw-col-span-8 sm:tw-col-span-12"
              />
            </FormGroup>
            <div className="tw-mb-6">
              {t(translations.analyticsDialog.message_2)}
            </div>
          </div>
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={onSubmit}
          />
        </div>
      </Dialog>
    </>
  );
}
