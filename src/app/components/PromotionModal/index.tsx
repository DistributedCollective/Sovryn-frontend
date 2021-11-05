import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { translations } from '../../../locales/i18n';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import SalesButton from '../SalesButton';
import imgLargeNFT from 'assets/origins_launchpad/MYNT_NFT.png';

import styles from 'app/components/Dialogs/dialog.module.scss';
import promotionModalStyles from './index.module.scss';

const SESSION_KEY = 'sovryn-promo-dialog-1'; //increment this whenever new content is added, to ensure users see it even if they viewed one previously

const shouldModalBeVisible = () => !local.getItem(SESSION_KEY);

export const PromotionModal: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(shouldModalBeVisible());
  const history = useHistory();
  useEffect(() => setShow(shouldModalBeVisible()), []);

  const handleClose = useCallback(() => {
    local.setItem(SESSION_KEY, '1');
    setShow(false);
  }, []);

  const handleSaleOpen = useCallback(() => {
    handleClose();
    history.push('/origins');
  }, [history, handleClose]);

  return (
    <Dialog
      isOpen={show}
      onClose={handleClose}
      isCloseButtonShown={true}
      canEscapeKeyClose={true}
      className={classNames('tw-w-full tw-max-w-6xl tw-p-6', styles.dialog)}
    >
      <div className="tw-font-light tw-text-center tw-w-full tw-mx-auto">
        <div className={promotionModalStyles.title}>
          {t(translations.promotionsDialog.title)}
        </div>
        <div className="tw-flex tw-flex-row">
          <div className="tw-w-6/12 tw-flex tw-justify-end tw-mr-16">
            <img
              src={imgLargeNFT}
              alt="MYNT"
              className="tw-border-solid tw-border-8 tw-border-gray-9 tw-rounded-3xl"
            />
          </div>
          <div className="tw-w-6/12 tw-mr-32">
            <div className={promotionModalStyles.dialogWrapper}>
              <div className={promotionModalStyles.title}>
                {t(translations.promotionsDialog.promotion1_title)}
              </div>
              <div>
                <div className={promotionModalStyles.listItem}>
                  {t(translations.promotionsDialog.promotion1_1)}
                </div>
                <div className={promotionModalStyles.listItem}>
                  <Trans
                    i18nKey={translations.promotionsDialog.promotion1_2}
                    components={[
                      <a
                        href="https://github.com/DistributedCollective/SIPS/blob/main/SIP-0037.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tw-underline tw-pl-1"
                      >
                        x
                      </a>,
                    ]}
                  />
                </div>
                <div className={promotionModalStyles.listItem}>
                  {t(translations.promotionsDialog.promotion1_3)}
                </div>
              </div>
              <SalesButton
                text={t(translations.promotionsDialog.promotion1_cta)}
                onClick={handleSaleOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
