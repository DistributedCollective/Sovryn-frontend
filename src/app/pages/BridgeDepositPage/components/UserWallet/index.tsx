import React, { useMemo } from 'react';
import blockies from 'ethereum-blockies';
import classNames from 'classnames';
import { prettyTx } from 'utils/helpers';

type UserWalletProps = {
  address: string;
  className?: string;
};

const UserWallet: React.FC<UserWalletProps> = ({ address, className }) => {
  const blockieImage = useMemo(() => {
    return blockies
      .create({
        // All options are optional
        seed: address, // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 8, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
      })
      .toDataURL();
  }, [address]);

  return (
    <div
      className={classNames(
        'tw-max-w-60 tw-absolute tw-top-4 tw-right-4 tw-left-4 md:tw-left-auto engage-wallet tw-w-full md:tw-w-auto tw-flex tw-justify-center tw-items-center tw-px-4 tw-justify-between tw-truncate',
        className,
      )}
    >
      <span>{prettyTx(address || '', 4, 4)}</span>
      <span className="tw-pl-2">
        <img className="tw-rounded" src={blockieImage} alt="wallet address" />
      </span>
    </div>
  );
};

export default UserWallet;
