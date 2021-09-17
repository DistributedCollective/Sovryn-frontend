import React, { useState } from 'react';
import styles from './dialog.module.scss';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'app/containers/Dialog';
import { translations } from 'locales/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  onChange: (value: number) => void;
}

export function LimitOrderSetting(props: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.duration);

  return (
    <Dialog
      isCloseButtonShown={false}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
    >
      <button data-close="" onClick={() => props.onClose()}>
        <span className="tw-sr-only">Close Dialog</span>
      </button>
      <h2 className="tw-mb-10 tw-text-3xl tw-leading-tight tw-font-semibold tw-text-center tw-normal-case">
        {t(translations.buySovPage.slippageDialog.title)}
      </h2>

      <div className="tw-px-4"></div>
    </Dialog>
  );
}
