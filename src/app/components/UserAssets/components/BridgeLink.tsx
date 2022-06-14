import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';

import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useIsBridgeLinkLocked } from '../hooks/useIsBridgeLinkLocked';

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
      <Tooltip
        position="top"
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        interactionKind="hover"
        content={
          <>
            {assetDepositLocked
              ? getMaintenanceTooltipCopy(asset, CROSSCHAIN_TYPE.DEPOSIT)
              : t(translations.userAssets.sendMessage, { asset })}
          </>
        }
      >
        {assetDepositLocked ? (
          <div className="tw-cursor-not-allowed tw-opacity-25">
            {t(translations.common.send)}
          </div>
        ) : (
          <Link
            to={{
              pathname: '/cross-chain/deposit',
              state: { receiver, asset },
            }}
          >
            <span className="tw-font-bold">{t(translations.common.send)}</span>
          </Link>
        )}
      </Tooltip>

      <Tooltip
        position="top"
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        interactionKind="hover"
        content={
          <>
            {assetWithdrawLocked
              ? getMaintenanceTooltipCopy(asset, CROSSCHAIN_TYPE.WITHDRAW)
              : t(translations.userAssets.receiveMessage, { asset })}
          </>
        }
      >
        {assetWithdrawLocked ? (
          <div className="tw-cursor-not-allowed tw-opacity-25">
            {t(translations.common.receive)}
          </div>
        ) : (
          <Link
            to={{
              pathname: '/cross-chain/withdraw',
              state: { receiver, asset },
            }}
          >
            <span className="tw-font-bold">
              {t(translations.common.receive)}
            </span>
          </Link>
        )}
      </Tooltip>
    </>
  );
};
