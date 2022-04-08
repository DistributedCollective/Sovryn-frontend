import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../../../containers/Dialog';
import { translations } from '../../../../../locales/i18n';

interface Props {
  children: React.ReactNode;
  showModal: boolean;
  onCloseModal: () => void;
}

export function PoolTransferDialog({ ...props }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.liquidity.PoolTransferDialog.title)}
          </h1>
          <div className="tw-mb-6 tw-text-sov-white tw-text-center tw-font-normal tw-text-sm">
            {t(translations.liquidity.PoolTransferDialog.subtitle)}
          </div>
          <div>{props.children}</div>
        </div>
      </Dialog>
    </>
  );
}
