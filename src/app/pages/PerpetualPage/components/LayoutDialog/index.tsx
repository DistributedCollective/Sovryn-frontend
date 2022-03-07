import React from 'react';
import { Dialog } from 'app/containers/Dialog/Loadable';
import { Switch } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

type LayoutDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LayoutDialog: React.FC<LayoutDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    showAmmDepth,
    showChart,
    showRecentTrades,
    showTables,
    showTradeForm,
  } = useSelector(selectPerpetualPage);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="tw-mw-340 tw-mx-auto">
        <h1 className="tw-text-sov-white tw-tracking-normal">
          {t(translations.perpetualPage.layoutDialog.title)}
        </h1>
        <Switch
          large
          label={t(translations.perpetualPage.layoutDialog.showAmmDepth)}
          checked={showAmmDepth}
          onChange={() => dispatch(actions.setShowAmmDepth(!showAmmDepth))}
        />
        <Switch
          large
          label={t(translations.perpetualPage.layoutDialog.showChart)}
          checked={showChart}
          onChange={() => dispatch(actions.setShowChart(!showChart))}
        />
        <Switch
          large
          label={t(translations.perpetualPage.layoutDialog.showRecentTrades)}
          checked={showRecentTrades}
          onChange={() =>
            dispatch(actions.setShowRecentTrades(!showRecentTrades))
          }
        />
        <Switch
          large
          label={t(translations.perpetualPage.layoutDialog.showTradeForm)}
          checked={showTradeForm}
          onChange={() => dispatch(actions.setShowTradeForm(!showTradeForm))}
        />
        <Switch
          large
          label={t(translations.perpetualPage.layoutDialog.showTables)}
          checked={showTables}
          onChange={() => dispatch(actions.setShowTables(!showTables))}
        />
      </div>
    </Dialog>
  );
};
