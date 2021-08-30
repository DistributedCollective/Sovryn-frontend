import React, { useState } from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { Switch } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { Input } from 'app/components/Form/Input';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';

interface INotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsDialog: React.FC<INotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const [telegramUsername, setTelegramUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [isTelegramActive, setIsTelegramActive] = useState(false);
  const [isDiscordActive, setIsDiscordActive] = useState(false);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mw-340 tw-mx-auto">
        <div className="tw-mb-8">
          {t(translations.marginTradePage.notificationSettingsDialog.title)}
        </div>

        <div className="tw-mb-6 tw-text-sm">
          {t(translations.marginTradePage.notificationSettingsDialog.notifyVia)}
          :
        </div>

        <div className="tw-mb-10">
          <div className="tw-flex tw-justify-between tw-mb-1.5">
            <div>Telegram</div>
            <Switch
              checked={isTelegramActive}
              onChange={() => setIsTelegramActive(prevValue => !prevValue)}
              large
            />
          </div>

          <FormGroup
            label={`${t(
              translations.marginTradePage.notificationSettingsDialog
                .telegramHandle,
            )}:`}
            className={
              !isTelegramActive
                ? 'tw-pointer-events-none tw-opacity-30 tw-cursor-not-allowed'
                : ''
            }
            labelClassName="tw-text-sm tw-font-normal tw-mb-2"
          >
            <Input
              value={telegramUsername}
              onChange={setTelegramUsername}
              placeholder={t(
                translations.marginTradePage.notificationSettingsDialog
                  .usernamePlaceholder,
              )}
              className="tw-rounded-lg tw-h-8"
              inputClassName="tw-font-medium"
            />
          </FormGroup>
        </div>

        <div className="tw-mb-6">
          <div className="tw-flex tw-justify-between tw-mb-1.5">
            <div>Discord</div>
            <Switch
              checked={isDiscordActive}
              onChange={() => setIsDiscordActive(prevValue => !prevValue)}
              large
            />
          </div>

          <FormGroup
            label={`${t(
              translations.marginTradePage.notificationSettingsDialog
                .discordHandle,
            )}:`}
            className={
              !isDiscordActive
                ? 'tw-pointer-events-none tw-opacity-30 tw-cursor-not-allowed'
                : ''
            }
            labelClassName="tw-text-sm tw-font-normal tw-mb-2"
          >
            <Input
              value={discordUsername}
              onChange={setDiscordUsername}
              placeholder={t(
                translations.marginTradePage.notificationSettingsDialog
                  .usernamePlaceholder,
              )}
              className="tw-rounded-lg tw-h-8"
              inputClassName="tw-font-medium"
            />
          </FormGroup>
        </div>

        <div className="tw-text-sm">
          {t(
            translations.marginTradePage.notificationSettingsDialog
              .receiveNotificationTitle,
          )}
          :
          <div className="tw-mt-6">
            <div>
              -{' '}
              {t(
                translations.marginTradePage.notificationSettingsDialog
                  .notificationEvents[1],
              )}
            </div>

            <div>
              -{' '}
              {t(
                translations.marginTradePage.notificationSettingsDialog
                  .notificationEvents[2],
              )}
            </div>
          </div>
        </div>

        <DialogButton
          confirmLabel={t(
            translations.marginTradePage.notificationSettingsDialog.submit,
          )}
          onConfirm={() =>
            console.log(
              `Telegram handle: ${telegramUsername} , Discord handle: ${discordUsername}`,
            )
          }
          disabled={!telegramUsername && !discordUsername}
          className="tw-rounded-lg tw-mt-10"
        />
      </div>
    </Dialog>
  );
};
