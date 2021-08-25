import React, { useCallback, useState } from 'react';
import { DialogTitle, DialogWrapper, ListItem } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Checkbox } from '@blueprintjs/core';
import { ActionButton } from 'app/components/Form/ActionButton';

interface IImportantInformationStepProps {
  tierId: number;
  onSubmit?: () => void;
}

export const ImportantInformationStep: React.FC<IImportantInformationStepProps> = ({
  tierId,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const onCheckboxClick = useCallback(
    () => setChecked(prevValue => !prevValue),
    [setChecked],
  );

  const baseTranslations =
    tierId === 2
      ? translations.originsLaunchpad.saleDay.importantInformationStep
          .publicSale
      : translations.originsLaunchpad.saleDay.importantInformationStep
          .privateSale;

  return (
    <>
      <DialogWrapper>
        <DialogTitle>{t(baseTranslations.title)}</DialogTitle>

        <div className="tw-flex">
          <div className="tw-text-left tw-max-w-40 tw-mr-20">
            <ListItem>{t(baseTranslations.information[1])}</ListItem>
            <ListItem>{t(baseTranslations.information[2])}</ListItem>
            <ListItem>{t(baseTranslations.information[3])}</ListItem>
            <ListItem>{t(baseTranslations.information[4])}</ListItem>
          </div>

          <div className="tw-text-left tw-max-w-40">
            <ListItem>{t(baseTranslations.information[5])}</ListItem>
            <ListItem>
              <strong>{t(baseTranslations.information[6])}</strong>
            </ListItem>
            <ListItem>{t(baseTranslations.information[7])}</ListItem>
            <ListItem>{t(baseTranslations.information[8])}</ListItem>
            {tierId === 2 && (
              <ListItem>{t(baseTranslations.information[9])}</ListItem>
            )}
          </div>
        </div>

        <div className="tw-mt-4 tw-flex tw-flex-col tw-items-center">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label={t(baseTranslations.checkboxText)}
            className="tw-text-left tw-text-sm"
          />

          <ActionButton
            text={t(baseTranslations.submitButtonText)}
            onClick={onSubmit}
            className="tw-block tw-max-w-xs tw-h-10 tw-px-24 tw-mt-6 tw-rounded-10px tw-bg-primary tw-bg-opacity-5"
            textClassName="tw-text-lg tw-tracking-normal tw-font-normal tw-leading-5.5"
            disabled={!checked}
          />
        </div>
      </DialogWrapper>
    </>
  );
};
