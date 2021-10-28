import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';

import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useIsBridgeLinkLocked } from './hooks/useIsBridgeLinkLocked';

interface IBridgeLinkProps {
  asset: Asset;
}

enum CROSSCHAIN_TYPE {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export const BridgeLink: React.FC<IBridgeLinkProps> = ({ asset }) => {
  const receiver = useAccount();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const getMaintenanceTooltipCopy = (
    asset: Asset,
    type: CROSSCHAIN_TYPE,
  ): string => {
    if (bridgeLocked) {
      return t(translations.maintenance.bridge);
    }

    switch (asset) {
      case Asset.SOV:
        return type === CROSSCHAIN_TYPE.DEPOSIT
          ? t(translations.maintenance.bridgeSovDeposit)
          : t(translations.maintenance.bridgeSovWithdraw);
      case Asset.ETH:
        return type === CROSSCHAIN_TYPE.DEPOSIT
          ? t(translations.maintenance.bridgeEthDeposit)
          : t(translations.maintenance.bridgeEthWithdraw);
      case Asset.BNB:
        return type === CROSSCHAIN_TYPE.DEPOSIT
          ? t(translations.maintenance.bridgeBnbDeposit)
          : t(translations.maintenance.bridgeBnbWithdraw);
      case Asset.XUSD:
        return type === CROSSCHAIN_TYPE.DEPOSIT
          ? t(translations.maintenance.bridgeXusdDeposit)
          : t(translations.maintenance.bridgeXusdWithdraw);
      default:
        return t(translations.maintenance.bridge);
    }
  };

  const { assetDepositLocked, assetWithdrawLocked } = useIsBridgeLinkLocked(
    asset,
  );

  return (
    <>
      {assetDepositLocked ? (
        <Tooltip
          position="bottom"
          hoverOpenDelay={0}
          hoverCloseDelay={0}
          interactionKind="hover"
          content={
            <>{getMaintenanceTooltipCopy(asset, CROSSCHAIN_TYPE.DEPOSIT)}</>
          }
        >
          <div className="tw-btn-action tw-cursor-not-allowed tw-opacity-25">
            {t(translations.common.deposit)}
          </div>
        </Tooltip>
      ) : (
        <Link
          className="tw-btn-action"
          to={{
            pathname: '/cross-chain/deposit',
            state: { receiver, asset },
          }}
        >
          <span>{t(translations.common.deposit)}</span>
        </Link>
      )}
      {assetWithdrawLocked ? (
        <Tooltip
          position="bottom"
          hoverOpenDelay={0}
          hoverCloseDelay={0}
          interactionKind="hover"
          content={
            <>{getMaintenanceTooltipCopy(asset, CROSSCHAIN_TYPE.WITHDRAW)}</>
          }
        >
          <div className="tw-btn-action tw-cursor-not-allowed tw-opacity-25">
            {t(translations.common.withdraw)}
          </div>
        </Tooltip>
      ) : (
        <Link
          className="tw-btn-action"
          to={{
            pathname: '/cross-chain/withdraw',
            state: { receiver, asset },
          }}
        >
          <span>{t(translations.common.withdraw)}</span>
        </Link>
      )}
    </>
  );
};
