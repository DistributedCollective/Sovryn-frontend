import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { FullVesting } from './types';
import { weiToNumberFormat } from '../../../../utils/display-text/format';
import { AssetSymbolRenderer } from '../../AssetSymbolRenderer';
import { Dialog } from '../../../containers/Dialog';

interface VestingUnlockScheduleDialogProps {
  vesting: FullVesting;
  isOpen: boolean;
  onClose: () => void;
}

export const VestingUnlockScheduleDialog: React.FC<VestingUnlockScheduleDialogProps> = ({
  vesting,
  isOpen,
  onClose,
}) => {
  const schedule = useMemo(
    () =>
      vesting.stakes.dates.map((date, index) => ({
        date: dayjs.tz(date, 'UTC').tz(dayjs.tz.guess()).format('L - LTS Z'),
        amount: vesting.stakes.stakes[index],
        unlocked: date.getTime() <= Date.now(),
      })),
    [vesting.stakes],
  );

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose}>
        <div className="tw-max-w-sm tw-mx-auto">
          {schedule.map((item, index) => (
            <div
              key={item.date}
              className={classNames(
                'tw-mt-2 tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-4 tw-text-xs',
                item.unlocked && 'tw-line-through',
              )}
            >
              <div className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-space-x-4">
                <div>#{index + 1}.</div>
                <div>{item.date}</div>
              </div>
              <div>
                {weiToNumberFormat(item.amount, 4)}{' '}
                <AssetSymbolRenderer asset={vesting.asset} />
              </div>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
