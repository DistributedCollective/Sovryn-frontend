import React, { FC, useMemo } from 'react';

import { translations } from '../../../../locales/i18n';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from '../hooks/useHandleSubscriptions';
import { Switch } from '@blueprintjs/core/lib/esm/components/forms/controls';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type SubscriptionsProps = {
  disabled?: boolean;
};

export const Subscriptions: FC<SubscriptionsProps> = ({ disabled }) => {
  const { t } = useTranslation();
  const {
    marginCallsToggle,
    spotCallsToggle,
  } = useEmailNotificationSettingsContext();
  const {
    marginCallsToggleHandler,
    spotCallsToggleHandler,
  } = useHandleSubscriptions();

  const switches = useMemo(
    () => [
      {
        label:
          translations.emailNotificationsDialog.alertGroups.marginTradingToggle,
        checked: marginCallsToggle,
        onChange: marginCallsToggleHandler,
      },
      {
        label:
          translations.emailNotificationsDialog.alertGroups.spotTradingToggle,
        checked: spotCallsToggle,
        onChange: spotCallsToggleHandler,
      },
    ],
    [
      marginCallsToggle,
      marginCallsToggleHandler,
      spotCallsToggle,
      spotCallsToggleHandler,
    ],
  );

  return (
    <div className="tw-my-6">
      {switches.map((subscription, index) => (
        <Switch
          key={index}
          checked={subscription.checked}
          onChange={subscription.onChange}
          className={classNames(
            'tw-mb-2 tw-p-0 tw-flex tw-justify-between tw-items-center tw-flex-row-reverse tw-text-sm tw-font-normal',
            {
              'tw-text-sov-white tw-opacity-50': disabled,
            },
          )}
          label={t(subscription.label)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
