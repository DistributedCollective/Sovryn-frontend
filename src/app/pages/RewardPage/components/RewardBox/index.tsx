/**
 *
 * RewardBox
 *
 */

import React from 'react';
import styled from 'styled-components/macro';
import cn from 'classnames';

interface Item {
  key: string;
  value: string | number;
}

interface Props {
  className?: object;
  title: string;
  items: Item[];
}
export function RewardBox({ className, title, items }: Props) {
  return (
    <Box className={cn(className, 'tw-p-4 tw-rounded-lg')}>
      <div className="tw-text-xl tw-font-semibold">{title}</div>
      <div className="tw-px-2 tw-pt-2 tw-flex tw-justify-between">
        {items.map((item, i) => {
          return (
            <div key={i} className="tw-text-sm tw-font-light">
              {item.key} <br />
              <span className="tw-font-medium">{item.value}</span>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  background: transparent
    radial-gradient(closest-side at 50% 105%, #e9eae9 0%, #222222 100%) 0% 0%
    no-repeat padding-box;
  mix-blend-mode: lighten;
`;
