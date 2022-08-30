import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { PERPETUAL_CHAIN_ID } from 'app/pages/PerpetualPage/types';
import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { prettyTx } from 'utils/helpers';
import { CommonRankingData } from '../../../../types';

type allowedWidths =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

type RowProps = {
  isActiveUser: boolean;
  isUser: boolean;
  data: CommonRankingData;
  rankWidth?: allowedWidths;
  walletWidth?: allowedWidths;
  children: React.ReactNode;
};

export const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    {
      isActiveUser,
      isUser,
      data,
      rankWidth = '1',
      walletWidth = '4',
      children,
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={classNames(
        'tw-flex tw-flex-row tw-py-3 tw-mb-2 tw-mr-4 tw-rounded tw-border',
        isUser
          ? 'tw-bg-gray-5 tw-border-opacity-25 tw-border-white'
          : 'tw-bg-gray-3 tw-border-transparent',
        {
          'tw-opacity-50': !isActiveUser,
        },
      )}
    >
      <div className={`tw-pl-3 tw-pr-1 tw-w-${rankWidth}/12 tw-my-auto`}>
        {data.rank}
      </div>
      <div className={`tw-pl-2 tw-pr-1 tw-w-${walletWidth}/12 tw-my-auto`}>
        <div
          className={classNames({
            'tw-inline-block tw-rounded tw-border tw-px-2 tw-py-1 tw-bg-gray-1 tw-border tw-border-opacity-25 tw-border-white': isUser,
          })}
        >
          <LinkToExplorer
            txHash={data.walletAddress.toLowerCase()}
            chainId={PERPETUAL_CHAIN_ID}
            text={data.userName || prettyTx(data.walletAddress)}
            isAddress
          />
        </div>
      </div>
      {children}
    </div>
  ),
);
