import React, { useCallback, useState } from 'react';
import { DialogTitle, DialogWrapper, ListItem } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Checkbox } from '@blueprintjs/core';
import { ActionButton } from 'app/components/Form/ActionButton';

interface IImportantInformationStepProps {
  tierId: number;
  saleName: string;
  onSubmit?: () => void;
}

export const ImportantInformationStep: React.FC<IImportantInformationStepProps> = ({
  tierId,
  saleName,
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
        <DialogTitle>
          {t(baseTranslations.title, { token: saleName })}
        </DialogTitle>

        <div className="tw-flex tw-flex-col tw-space-y-4 lg:tw-flex-row lg:tw-space-y-0 lg:tw-space-x-20">
          <div className="tw-text-left tw-max-w-1/5 tw-mr-20">
            <ListItem>
              {t(baseTranslations.information[1], { token: saleName })}
            </ListItem>
            <ListItem>
              {t(baseTranslations.information[2], { token: saleName })}
            </ListItem>
            <ListItem>
              {t(baseTranslations.information[3], { token: saleName })}
            </ListItem>
            <ListItem>
              {t(baseTranslations.information[4], { token: saleName })}
            </ListItem>
          </div>

          <div className="tw-text-left tw-w-full lg:tw-w-1/2">
            <ListItem>
              <strong>
                {t(baseTranslations.information[6], { token: saleName })}
              </strong>
            </ListItem>
            <ListItem>
              {t(baseTranslations.information[7], { token: saleName })}
            </ListItem>
            <ListItem>
              {t(baseTranslations.information[8], { token: saleName })}
            </ListItem>
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
            className="tw-block tw-h-10 tw-px-24 tw-mt-6 tw-rounded-xl tw-bg-gray-1 tw-bg-opacity-10"
            textClassName="tw-text-lg tw-tracking-normal tw-font-normal tw-leading-snug"
            disabled={!checked}
          />
        </div>
      </DialogWrapper>
    </>
  );
};
