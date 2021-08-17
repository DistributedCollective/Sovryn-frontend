import React from 'react';
import { useTimer } from 'react-timer-hook';
import { Digit } from './Digit';

interface ITimerProps {
  expiryTimestamp: number;
  onExpire: () => void;
}

export const Timer: React.FC<ITimerProps> = ({ expiryTimestamp, onExpire }) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire,
  });

  return (
    <div className="tw-bg-gray-1 tw-px-5 tw-pt-3 tw-pb-7 tw-rounded-10px tw-text-3xl tw-font-semibold tw-flex tw-items-center">
      <Digit value={days} title="DAYS" />:
      <Digit value={hours} title="HOURS" />:
      <Digit value={minutes} title="MINS" />:
      <Digit value={seconds} title="SECS" />
    </div>
  );
};
