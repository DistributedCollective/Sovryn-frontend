import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import { translations } from '../../../locales/i18n';
import { local } from '../../../utils/storage';
import { Dialog } from '../../containers/Dialog/Loadable';
import SalesButton from '../SalesButton';
import imgLargeNFT from 'assets/origins_launchpad/MYNT_NFT.png';
import { DialogWrapper, ListItem } from './styled';
import styles from 'app/components/Dialogs/dialog.module.scss';

const SESSION_KEY = 'sovryn-promo-dialog-1'; //increment this whenever new content is added, to ensure users see it even if they viewed one previously

const shouldModalBeVisible = () => !local.getItem(SESSION_KEY);

export const PromotionModal: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(shouldModalBeVisible());
  const history = useHistory();
  useEffect(() => setShow(shouldModalBeVisible()), []);

  const handleClose = () => {
    local.setItem(SESSION_KEY, '1');
    setShow(false);
  };

  const handleSaleOpen = () => {
    handleClose();
    history.push('/origins');
  };

  return (
    <Dialog
      isOpen={show}
      onClose={handleClose}
      isCloseButtonShown={true}
      canEscapeKeyClose={true}
      className={cn('tw-w-full tw-max-w-6xl tw-p-6', styles.dialog)}
    >
      <div className="tw-font-light tw-text-center tw-w-full tw-mx-auto">
        <div
          className="tw-font-bold tw-text-center tw-mb-6"
          style={{ fontSize: '25px' }}
        >
          {t(translations.promotionsDialog.title)}
        </div>
        <div className="tw-flex tw-flex-row">
          <div className="tw-w-6/12 tw-flex tw-justify-end tw-mr-16">
            <img
              src={imgLargeNFT}
              alt="MYNT"
              className="tw-border-8 tw-border-gray-9 tw-rounded-3xl"
            />
          </div>
          <div className="tw-w-6/12 tw-mr-32">
            <DialogWrapper className="tw-justify-evenly tw-h-full">
              <div
                className="tw-font-bold tw-text-center tw-mb-6"
                style={{ fontSize: '25px' }}
              >
                {t(translations.promotionsDialog.promotion1_title)}
              </div>
              <div className="">
                <ListItem>
                  {t(translations.promotionsDialog.promotion1_1)}
                </ListItem>
                <ListItem>
                  <Trans
                    i18nKey={translations.promotionsDialog.promotion1_2}
                    components={[
                      <a
                        href="https://forum.sovryn.app/t/draft-sip-the-sovryn-mynt/1954"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tw-underline tw-pl-1"
                      >
                        x
                      </a>,
                    ]}
                  />
                </ListItem>
                <ListItem>
                  {t(translations.promotionsDialog.promotion1_3)}
                </ListItem>
              </div>
              <SalesButton
                text={t(translations.promotionsDialog.promotion1_cta)}
                onClick={handleSaleOpen}
              />
            </DialogWrapper>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
