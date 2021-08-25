import React, { useCallback, useState } from 'react';
import { DialogTitle, DialogWrapper, ListItem } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Checkbox } from '@blueprintjs/core';
import { ActionButton } from 'app/components/Form/ActionButton';

interface IImportantInformationStepProps {
  onSubmit?: () => void;
}

export const ImportantInformationStep: React.FC<IImportantInformationStepProps> = ({
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const onCheckboxClick = useCallback(
    () => setChecked(prevValue => !prevValue),
    [setChecked],
  );

  return (
    <>
      <DialogWrapper>
        <DialogTitle>
          {t(
            translations.originsLaunchpad.saleDay.importantInformationStep
              .title,
          )}
        </DialogTitle>

        <div className="tw-flex tw-flex-col tw-gap-4 lg:tw-gap-20 lg:tw-flex-row">
          <div className="tw-text-left tw-w-full lg:tw-w-1/2">
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[1],
              )}
            </ListItem>
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[2],
              )}
            </ListItem>
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[3],
              )}
            </ListItem>
          </div>

          <div className="tw-text-left tw-w-full lg:tw-w-1/2">
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[4],
              )}
            </ListItem>
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[5],
              )}
            </ListItem>
            <ListItem>
              {t(
                translations.originsLaunchpad.saleDay.importantInformationStep
                  .information[6],
              )}
            </ListItem>
          </div>
        </div>

        <div className="tw-mt-4 tw-flex tw-flex-col tw-items-center">
          <Checkbox
            checked={checked}
            onChange={onCheckboxClick}
            label={t(
              translations.originsLaunchpad.saleDay.importantInformationStep
                .checkboxText,
            )}
            className="tw-text-left tw-text-sm"
          />

          <ActionButton
            text={t(
              translations.originsLaunchpad.saleDay.importantInformationStep
                .submitButtonText,
            )}
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
