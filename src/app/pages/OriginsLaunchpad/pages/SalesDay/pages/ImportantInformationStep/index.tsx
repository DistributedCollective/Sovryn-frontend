import React, { useCallback, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import { translations } from 'locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { discordInvite, sovrynTelegram } from 'utils/classifiers';
import styles from './index.module.scss';

interface IImportantInformationStepProps {
  saleName: string;
  onSubmit?: () => void;
}

export const ImportantInformationStep: React.FC<IImportantInformationStepProps> = ({
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
    translations.originsLaunchpad.saleDay.importantInformationStep.publicSale;

  return (
    <>
      <div className={styles.dialogWrapper}>
        <div className={styles.dialogTitle}>
          {t(baseTranslations.title, { token: saleName })}
        </div>

        <div className="tw-flex tw-flex-col tw-space-y-4 lg:tw-flex-row lg:tw-space-y-0 lg:tw-space-x-20">
          <div className="tw-text-left tw-w-full lg:tw-w-1/2 tw-mr-20">
            <div className={styles.listItem}>
              {t(baseTranslations.information[1], { token: saleName })}
            </div>
            <div className={styles.listItem}>
              {t(baseTranslations.information[2], { token: saleName })}
            </div>
            <div className={styles.listItem}>
              <div>
                <Trans
                  i18nKey={baseTranslations.information[3]}
                  components={[
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tw-inline tw-underline"
                    >
                      x
                    </a>,
                    <a
                      href={sovrynTelegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tw-inline tw-underline"
                    >
                      x
                    </a>,
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="tw-text-left tw-w-full lg:tw-w-1/2">
            <div className={styles.listItem}>
              <strong>
                {t(baseTranslations.information[6], { token: saleName })}
              </strong>
            </div>
            <div className={styles.listItem}>
              <strong>
                {t(baseTranslations.information[4], { token: saleName })}
              </strong>
            </div>
            <div className={styles.listItem}>
              {t(baseTranslations.information[5], { token: saleName })}
            </div>
            <div className={styles.listItem}>
              {t(baseTranslations.information[7], { token: saleName })}
            </div>
            <div className={styles.listItem}>
              <div>
                <Trans
                  i18nKey={baseTranslations.information[8]}
                  values={{ token: saleName }}
                  components={[
                    <Link to="/wallet" className="tw-underline">
                      x
                    </Link>,
                  ]}
                />
              </div>
            </div>
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
      </div>
    </>
  );
};
