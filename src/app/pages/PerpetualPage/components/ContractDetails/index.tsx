import React, { useContext } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { usePerpetual_ContractDetails } from '../../hooks/usePerpetual_ContractDetails';
import { numberToPercent } from '../../../../../utils/display-text/format';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { Tooltip } from '@blueprintjs/core';
import { PerpetualQueriesContext } from '../../contexts/PerpetualQueriesContext';
import { LayoutMenu } from '../LayoutMenu';
import { usePerpetual_getCurrentPairId } from '../../hooks/usePerpetual_getCurrentPairId';

type ContractDetailsProps = {
  pair: PerpetualPair;
};

export const ContractDetails: React.FC<ContractDetailsProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_ContractDetails(pair.pairType);

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { lotPrecision } = perpetuals[currentPairId];

  return (
    <div className="tw-w-full tw-bg-black">
      <div className="tw-container tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-px-8">
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-flex-wrap tw-items-start sm:tw-items-center tw-py-2">
          <ContractDetailEntry
            title={t(translations.perpetualPage.contractDetails.volume24h)}
            value={
              <AssetValue
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={data?.volume24h || 0}
                assetString={pair.baseAsset}
              />
            }
          />
          <ContractDetailEntry
            title={t(translations.perpetualPage.contractDetails.openInterest)}
            tooltip={t(
              translations.perpetualPage.contractDetails.tooltips.openInterest,
            )}
            value={
              <AssetValue
                minDecimals={2}
                maxDecimals={2}
                mode={AssetValueMode.auto}
                value={data?.openInterest || 0}
                assetString={pair.baseAsset}
              />
            }
          />
          <ContractDetailEntry
            title={t(translations.perpetualPage.contractDetails.fundingRate)}
            tooltip={t(
              translations.perpetualPage.contractDetails.tooltips.fundingRate,
            )}
            value={
              <>
                <span
                  className={classNames('tw-text-sm tw-font-medium', {
                    'tw-text-trade-short':
                      data?.fundingRate && data.fundingRate < 0,
                    'tw-text-trade-long':
                      data?.fundingRate && data.fundingRate > 0,
                  })}
                >
                  {data?.fundingRate && numberToPercent(data.fundingRate, 4)}
                </span>
              </>
            }
          />
          <ContractDetailEntry
            title={t(translations.perpetualPage.contractDetails.lotSize)}
            value={
              <AssetValue
                minDecimals={lotPrecision}
                maxDecimals={lotPrecision}
                mode={AssetValueMode.auto}
                value={data?.lotSize || 0}
                assetString={pair.baseAsset}
              />
            }
          />
          <ContractDetailEntry
            title={t(
              translations.perpetualPage.contractDetails.minPositionSize,
            )}
            value={
              <AssetValue
                minDecimals={lotPrecision}
                maxDecimals={lotPrecision}
                mode={AssetValueMode.auto}
                value={data?.minPositionSize || 0}
                assetString={pair.baseAsset}
              />
            }
          />
        </div>
        <div className="tw-flex-none tw-py-2">
          <LayoutMenu />
        </div>
      </div>
    </div>
  );
};

type ContractDetailEntryProps = {
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  title: React.ReactNode;
  tooltip?: React.ReactElement | string;
  value: React.ReactNode;
};

const ContractDetailEntry: React.FC<ContractDetailEntryProps> = ({
  className,
  titleClassName,
  valueClassName,
  title,
  tooltip,
  value,
}) => (
  <div className={classNames('sm:tw-mr-8', className)}>
    <Tooltip
      content={tooltip}
      popoverClassName="tw-max-w-md tw-font-light"
      position="bottom"
    >
      <span className={classNames('tw-mr-2.5 tw-text-xs', titleClassName)}>
        {title}
      </span>
    </Tooltip>
    <span className={classNames('tw-text-sm tw-font-medium', valueClassName)}>
      {value}
    </span>
  </div>
);
