import React from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';

interface INotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsDialog: React.FC<INotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mw-340 tw-mx-auto">Notification settings</div>
    </Dialog>
  );
};
