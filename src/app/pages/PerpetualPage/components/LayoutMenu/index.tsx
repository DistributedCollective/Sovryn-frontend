import React from 'react';
import { Switch, Popover } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectPerpetualPage } from '../../selectors';
import { actions } from '../../slice';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';

export const LayoutMenu: React.FC = () => {
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
    <Popover
      popoverClassName="tw-border-none tw-bg-red"
      content={
        <div className="tw-px-4 tw-py-8">
          <Switch
            large
            label={t(
              translations.perpetualPage.layout[
                showAmmDepth ? 'hideAmmDepth' : 'showAmmDepth'
              ],
            )}
            checked={showAmmDepth}
            onChange={() => dispatch(actions.setShowAmmDepth(!showAmmDepth))}
          />
          <Switch
            large
            label={t(
              translations.perpetualPage.layout[
                showChart ? 'hideChart' : 'showChart'
              ],
            )}
            checked={showChart}
            onChange={() => dispatch(actions.setShowChart(!showChart))}
          />
          <Switch
            large
            label={t(
              translations.perpetualPage.layout[
                showRecentTrades ? 'hideRecentTrades' : 'showRecentTrades'
              ],
            )}
            checked={showRecentTrades}
            onChange={() =>
              dispatch(actions.setShowRecentTrades(!showRecentTrades))
            }
          />
          <Switch
            large
            label={t(
              translations.perpetualPage.layout[
                showTradeForm ? 'hideTradeForm' : 'showTradeForm'
              ],
            )}
            checked={showTradeForm}
            onChange={() => dispatch(actions.setShowTradeForm(!showTradeForm))}
          />
          <Switch
            className="tw-mb-0"
            large
            label={t(
              translations.perpetualPage.layout[
                showTables ? 'hideTables' : 'showTables'
              ],
            )}
            checked={showTables}
            onChange={() => dispatch(actions.setShowTables(!showTables))}
          />
        </div>
      }
    >
      <button className="tw-flex tw-items-center tw-py-1 tw-bg-gray-3 tw-px-5 tw-rounded-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75">
        <div className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-flex-shrink-0 tw-flex-grow tw-mr-4">
          {t(translations.perpetualPage.layout.button)}
        </div>
        <img className="tw-w-3 tw-ml-2" src={arrowDownIcon} alt="Arrow Down" />
      </button>
    </Popover>
  );
};
