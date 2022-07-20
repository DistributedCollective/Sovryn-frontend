import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logoSvg from 'assets/images/tokens/sov.svg';
import { translations } from 'locales/i18n';
import { LoadableValue } from 'app/components/LoadableValue';
import { Asset } from 'types/asset';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Icon } from 'app/components/Icon';
import { VestedContractFieldsFragment } from 'utils/graphql/rsk/generated';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { ActionButton } from 'app/components/Form/ActionButton';
import { VestedHistoryTable } from './VestedHistoryTable';

interface IVestedHistoryContractsProps {
  events: VestedContractFieldsFragment;
}

export const VestedHistoryContracts: React.FC<IVestedHistoryContractsProps> = ({
  events,
}) => {
  const { t } = useTranslation();
  const { stakeHistory, type, startingBalance, createdAtTransaction } = events;
  const [showDetails, setShowDetails] = useState(false);
  const dollarValue = useDollarValue(Asset.SOV, startingBalance || '0');

  return (
    <>
      <tr>
        <td className="tw-text-left tw-font-normal tw-tracking-normal">
          <div className="assetname tw-flex tw-items-center">
            <div>
              <img src={logoSvg} className="tw-mr-3" alt="SOV" />
            </div>
            <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
              {type}
            </div>
          </div>
        </td>
        <td className="tw-text-left tw-font-normal tw-tracking-normal">
          <AssetValue
            asset={Asset.SOV}
            value={Number(startingBalance)}
            useTooltip
            mode={AssetValueMode.auto}
            maxDecimals={8}
          />
          <br />≈{' '}
          <LoadableValue
            value={
              <AssetValue value={Number(dollarValue.value)} assetString="USD" />
            }
            loading={dollarValue.loading}
          />
        </td>
        <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
          <LinkToExplorer
            txHash={createdAtTransaction.id}
            className="tw-m-0 tw-whitespace-nowrap"
            startLength={5}
            endLength={5}
          />
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
            <div>
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
              <LinkToExplorer
                txHash={createdAtTransaction.id}
                className="tw-m-0 tw-whitespace-nowrap"
                startLength={5}
                endLength={5}
              />
            </div>
            <Icon icon="success-tx" className="tw-text-success" size={28} />
          </div>
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
            <ActionButton
              text={t(translations.tradingHistoryPage.table.cta.details)}
              onClick={() => setShowDetails(!showDetails)}
              className="tw-border-none tw-ml-0 tw-pl-4 xl:tw-pl-2 tw-pr-0"
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              disabled={events.stakeHistory?.length === 0}
              data-action-id="margin-openPositions-DetailsButton"
            />
          </div>
        </td>
      </tr>
      {showDetails && stakeHistory && (
        <VestedHistoryTable type={type} events={stakeHistory} />
      )}
    </>
  );
};
