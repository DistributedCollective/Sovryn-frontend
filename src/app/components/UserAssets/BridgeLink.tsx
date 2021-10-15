import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';

import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';

interface Props {
  asset: Asset;
}

export function BridgeLink({ asset }: Props) {
  const receiver = useAccount();
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const { [States.BRIDGE]: bridgeLocked } = checkMaintenances();

  return (
    <>
      {bridgeLocked ? (
        <>
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.bridge)}</>}
          >
            <div className="tw-btn-action tw-cursor-not-allowed tw-opacity-25">
              {t(translations.common.deposit)}
            </div>
          </Tooltip>
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.bridge)}</>}
          >
            <div className="tw-btn-action tw-cursor-not-allowed tw-opacity-25">
              {t(translations.common.withdraw)}
            </div>
          </Tooltip>
        </>
      ) : (
        <>
          <Link
            className="tw-btn-action"
            to={{
              pathname: '/cross-chain/deposit',
              state: { receiver, asset },
            }}
          >
            <span>{t(translations.common.deposit)}</span>
          </Link>
          <Link
            className="tw-btn-action"
            to={{
              pathname: '/cross-chain/withdraw',
              state: { receiver, asset },
            }}
          >
            <span>{t(translations.common.withdraw)}</span>
          </Link>
        </>
      )}
    </>
  );
}
