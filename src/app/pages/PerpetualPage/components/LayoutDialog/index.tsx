import React from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { Switch } from '@blueprintjs/core';

type LayoutDialogProps = {
  isOpen: boolean;
  showAmm: boolean;
  showChart: boolean;
  showRecentTrades: boolean;
  showTradeForm: boolean;
  showTables: boolean;
  onShowAmm: () => void;
  onShowChart: () => void;
  onShowRecentTrades: () => void;
  onShowTradeForm: () => void;
  onShowTables: () => void;
  onClose: () => void;
};

export const LayoutDialog: React.FC<LayoutDialogProps> = ({
  isOpen,
  showAmm,
  showChart,
  showRecentTrades,
  showTradeForm,
  showTables,
  onShowAmm,
  onShowChart,
  onShowRecentTrades,
  onShowTables,
  onShowTradeForm,
  onClose,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mw-340 tw-mx-auto">
        <h1 className="tw-text-sov-white tw-tracking-normal">
          Customize layout
        </h1>
        <Switch large label="Show Amm" checked={showAmm} onChange={onShowAmm} />
        <Switch
          large
          label="Show Chart"
          checked={showChart}
          onChange={onShowChart}
        />
        <Switch
          large
          label="Show Recent Trades"
          checked={showRecentTrades}
          onChange={onShowRecentTrades}
        />
        <Switch
          large
          label="Show Trade Form"
          checked={showTradeForm}
          onChange={onShowTradeForm}
        />
        <Switch
          large
          label="Show Tables"
          checked={showTables}
          onChange={onShowTables}
        />
      </div>
    </Dialog>
  );
};
