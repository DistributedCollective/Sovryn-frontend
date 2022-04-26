import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React from 'react';
import { Trans } from 'react-i18next';
import { discordInvite } from 'utils/classifiers';

type ActionDialogSubmitButtonProps = {
  inMaintenance: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  maintenanceClassName?: string;
};

export const ActionDialogSubmitButton: React.FC<ActionDialogSubmitButtonProps> = ({
  inMaintenance,
  isDisabled,
  onClick,
  children,
  className,
  maintenanceClassName,
}) => (
  <>
    {!inMaintenance ? (
      <button
        className={classNames(
          'tw-w-full tw-min-h-10 tw-p-2 tw-mt-4 tw-text-lg tw-text-primary tw-font-medium tw-border tw-border-primary tw-bg-primary-10 tw-rounded-lg tw-transition-colors tw-transition-opacity tw-duration-300',
          isDisabled
            ? 'tw-opacity-25 tw-cursor-not-allowed'
            : 'tw-opacity-100 hover:tw-bg-primary-25',
          className,
        )}
        disabled={isDisabled}
        onClick={onClick}
      >
        {children}
      </button>
    ) : (
      <ErrorBadge
        content={
          <Trans
            i18nKey={translations.maintenance.perpetualsTrade}
            components={[
              <a
                href={discordInvite}
                target="_blank"
                rel="noreferrer noopener"
                className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
              >
                x
              </a>,
            ]}
          />
        }
        className={classNames('tw-mb-0 tw-pb-0', maintenanceClassName)}
      />
    )}
  </>
);
