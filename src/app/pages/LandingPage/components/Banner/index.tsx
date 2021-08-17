import React, { useState } from 'react';

import babelfishBanner from 'assets/images/banner/babelFish-promo.svg';
import { Timer } from './components/Timer/index';
import { Button } from 'app/components/Button';

export const Banner: React.FC = () => {
  const time = Date.parse('2021-08-26T14:00:00');
  const now = new Date().getTime();
  const [isLive, setIsLive] = useState(time < now);

  return (
    <div className="tw-relative tw-w-full tw-h-full">
      <img
        src={babelfishBanner}
        className="tw-w-full tw-h-full tw-object-cover tw-object-left tw-rounded-2xl tw-border tw-border-solid tw-border-turquoise2"
        alt="babelfish"
      />
      <div className="tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0 tw-p-4">
        <div className="tw-text-center tw-text-white tw-text-3xl tw-font-semibold">
          Origins FISH token sale
        </div>
        <div className="tw-flex tw-flex-col tw-items-end tw-mt-4">
          <div>
            {!isLive && (
              <Timer expiryTimestamp={time} onExpire={() => setIsLive(true)} />
            )}
            {isLive && (
              <div className="tw-bg-gray-1 tw-px-14 tw-py-5 tw-rounded-10px tw-text-3xl tw-font-semibold tw-text-center">
                LIVE NOW!
              </div>
            )}
            <Button
              className="tw-w-full tw-mt-4"
              text={isLive ? 'Buy Now' : 'Learn More'}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
