import React, { FC } from 'react';

import { translations } from '../../../../locales/i18n';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from '../hooks/useHandleSubscriptions';
import { Switch } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type SubscriptionsProps = {
  isDisabled?: boolean;
};

export const Subscriptions: FC<SubscriptionsProps> = ({ isDisabled }) => {
  const { t } = useTranslation();
  const {
    marginCallsToggle,
    spotCallsToggle,
  } = useEmailNotificationSettingsContext();
  const {
    marginCallsToggleHandler,
    spotCallsToggleHandler,
  } = useHandleSubscriptions();

  return (
    <div className="tw-my-6">
      <Switch
        checked={marginCallsToggle}
        onChange={marginCallsToggleHandler}
        className={classNames(
          'tw-mb-2 tw-p-0 tw-flex tw-justify-between tw-items-center tw-flex-row-reverse tw-text-sm tw-font-normal',
          {
            'tw-text-sov-white tw-opacity-50': isDisabled,
          },
        )}
        label={t(
          translations.emailNotificationsDialog.alertGroups.marginTradingToggle,
        )}
        disabled={isDisabled}
      />
      <Switch
        checked={spotCallsToggle}
        onChange={spotCallsToggleHandler}
        className={classNames(
          'tw-p-0 tw-flex tw-justify-between tw-items-center tw-flex-row-reverse tw-text-sm tw-font-normal',
          {
            'tw-text-sov-white tw-opacity-50': isDisabled,
          },
        )}
        label={t(
          translations.emailNotificationsDialog.alertGroups.spotTradingToggle,
        )}
        disabled={isDisabled}
      />
    </div>
  );
};
