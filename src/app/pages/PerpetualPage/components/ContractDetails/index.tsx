import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { usePerpetual_ContractDetails } from '../../hooks/usePerpetual_ContractDetails';
import { numberToPercent } from '../../../../../utils/display-text/format';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

type ContractDetailsProps = {
  pair: PerpetualPair;
};

export const ContractDetails: React.FC<ContractDetailsProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_ContractDetails();

  return (
    <div className="tw-w-full tw-bg-black">
      <div className="tw-container tw-flex tw-flex-col sm:tw-flex-row tw-flex-wrap tw-items-start sm:tw-items-center tw-px-8 tw-py-2">
        <h3 className="tw-mt-0.5 sm:tw-mr-5 tw-text-sm tw-font-semibold tw-normal-case">
          {t(translations.perpetualPage.contractDetails.title)}
        </h3>
        <ContractDetailEntry
          titleClassName="tw-font-medium"
          valueClassName="tw-text-primary tw-font-semibold"
          title={t(translations.perpetualPage.contractDetails.markPrice)}
          value={
            <AssetValue
              minDecimals={2}
              maxDecimals={2}
              mode={AssetValueMode.auto}
              value={data?.markPrice || 0}
              assetString={pair.quoteAsset}
            />
          }
        />
        <ContractDetailEntry
          titleClassName="tw-font-medium"
          valueClassName="tw-font-semibold"
          title={t(translations.perpetualPage.contractDetails.indexPrice)}
          value={
            <AssetValue
              minDecimals={2}
              maxDecimals={2}
              mode={AssetValueMode.auto}
              value={data?.indexPrice || 0}
              assetString={pair.quoteAsset}
            />
          }
        />
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
              minDecimals={3}
              maxDecimals={3}
              mode={AssetValueMode.auto}
              value={data?.lotSize || 0}
              assetString={pair.baseAsset}
            />
          }
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.minTradeAmount)}
          value={
            <AssetValue
              minDecimals={3}
              maxDecimals={3}
              mode={AssetValueMode.auto}
              value={data?.minTradeAmount || 0}
              assetString={pair.baseAsset}
            />
          }
        />
      </div>
    </div>
  );
};

type ContractDetailEntryProps = {
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
  title: React.ReactNode;
  value: React.ReactNode;
};

const ContractDetailEntry: React.FC<ContractDetailEntryProps> = ({
  className,
  titleClassName,
  valueClassName,
  title,
  value,
}) => (
  <div className={classNames('sm:tw-mr-8', className)}>
    <span className={classNames('tw-mr-2.5 tw-text-xs', titleClassName)}>
      {title}
    </span>
    <span className={classNames('tw-text-sm tw-font-medium', valueClassName)}>
      {value}
    </span>
  </div>
);
