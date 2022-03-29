import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import React from 'react';

type HelpBadgeProps = {
  tooltip: React.ReactNode;
};

export const HelpBadge: React.FC<HelpBadgeProps> = ({ children, tooltip }) => {
  return (
    <span className="tw-flex tw-flex-row tw-justify-start tw-align-center">
      <span className="tw-flex-shrink tw-truncate">{children}</span>
      <span className="tw-ml-1 tw-flex-shrink tw-flex-grow-0">
        <Popover
          content={<div className="mw-content">{tooltip}</div>}
          popoverClassName="mw-tooltip"
          target={<Icon className="tw-cursor-pointer" icon="info-sign" />}
        />
      </span>
    </span>
  );
};
