import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@blueprintjs/core';
import { LoadableValue } from '../../LoadableValue';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../../utils/display-text/format';
import { weiTo4 } from '../../../../utils/blockchain/math-helpers';
import { translations } from '../../../../locales/i18n';
import { ActionButton } from '../../Form/ActionButton';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { FullVesting } from './useListOfUserVestings';
import { useDollarValue } from '../../../hooks/useDollarValue';

type VestedItemProps = {
  vesting: FullVesting;
  onWithdraw: (vesting: FullVesting) => void;
};

export const VestedItem: React.FC<VestedItemProps> = ({
  vesting,
  onWithdraw,
}) => {
  const { logoSvg, symbol } = AssetsDictionary.get(vesting.asset);

  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const withdrawLocked = checkMaintenance(States.WITHDRAW_VESTS);
  const dollarValue = useDollarValue(vesting.asset, vesting.balance);

  const handleOnWithdraw = useCallback(() => onWithdraw(vesting), [
    vesting,
    onWithdraw,
  ]);

  return (
    <tr>
      <td>
        <img
          className="tw-inline tw-mr-2 tw-h-8 tw-w-8"
          src={logoSvg}
          alt={vesting.asset}
        />{' '}
        {vesting.label || symbol}
      </td>
      <td className="tw-text-right">{weiToNumberFormat(vesting.balance, 4)}</td>
      <td className="tw-text-right">
        <LoadableValue
          value={numberToUSD(Number(weiTo4(dollarValue.value)), 4)}
          loading={dollarValue.loading}
        />
      </td>
      <td className="tw-text-right">
        {withdrawLocked ? (
          <Tooltip
            position="bottom"
            hoverOpenDelay={0}
            hoverCloseDelay={0}
            interactionKind="hover"
            content={<>{t(translations.maintenance.withdrawVests)}</>}
          >
            <ActionButton
              className="tw-inline-block tw-cursor-not-allowed"
              text={t(translations.userAssets.actions.withdraw)}
            />
          </Tooltip>
        ) : (
          <ActionButton
            className="tw-inline-block"
            text={t(translations.userAssets.actions.withdraw)}
            onClick={handleOnWithdraw}
          />
        )}
      </td>
    </tr>
  );
};
