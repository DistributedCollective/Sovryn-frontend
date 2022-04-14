import React, { MouseEventHandler, ReactElement } from 'react';
import { Tooltip } from '@blueprintjs/core';

type RowActionProps = {
  tooltip: ReactElement | string;
  label: ReactElement | string;
  onClick: MouseEventHandler;
};

export const RowAction: React.FC<RowActionProps> = ({
  tooltip,
  label,
  onClick,
}) => (
  <Tooltip
    position="bottom"
    popoverClassName="tw-max-w-md tw-font-light"
    content={tooltip}
  >
    <button
      className="tw-mr-8 tw-text-primary tw-text-sm tw-font-medium"
      onClick={onClick}
    >
      {label}
    </button>
  </Tooltip>
);
