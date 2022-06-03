import React, { MouseEventHandler, ReactElement } from 'react';
import { Tooltip } from '@blueprintjs/core';

type TableRowActionProps = {
  tooltip: ReactElement | string;
  label: ReactElement | string;
  onClick: MouseEventHandler;
};

export const TableRowAction: React.FC<TableRowActionProps> = ({
  tooltip,
  label,
  onClick,
}) => (
  <Tooltip
    className="tw-mr-8"
    position="bottom"
    popoverClassName="tw-max-w-md tw-font-light"
    content={tooltip}
  >
    <button
      className="tw-text-primary tw-text-sm tw-font-medium"
      onClick={onClick}
    >
      {label}
    </button>
  </Tooltip>
);
