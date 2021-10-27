import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { usePerpetual_ContractDetails } from '../../hooks/usePerpetual_ContractDetails';
import {
  numberToPercent,
  toNumberFormat,
} from '../../../../../utils/display-text/format';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';

type ContractDetailsProps = {
  pair: PerpetualPair;
};

export const ContractDetails: React.FC<ContractDetailsProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_ContractDetails(pair);

  return (
    <div className="tw-w-full tw-bg-black tw-py-2">
      <div className="tw-container tw-flex tw-flex-col sm:tw-flex-row tw-flex-wrap tw-items-start sm:tw-items-center">
        <h3 className="tw-mt-0.5 sm:tw-mr-5 tw-text-sm tw-font-semibold tw-normal-case">
          {t(translations.perpetualPage.contractDetails.title)}
        </h3>
        <ContractDetailEntry
          titleClassName="tw-font-medium"
          valueClassName="tw-text-primary tw-font-semibold"
          title={t(translations.perpetualPage.contractDetails.indexPrice)}
          value={data?.indexPrice && toNumberFormat(data.indexPrice, 2)}
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.volume24h)}
          value={
            data?.volume24h && (
              <>
                {toNumberFormat(data.volume24h, 2)}{' '}
                <AssetSymbolRenderer assetString={pair.longAsset} />
              </>
            )
          }
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.openInterest)}
          value={
            data?.openInterest && (
              <>
                {toNumberFormat(data.openInterest, 2)}{' '}
                <AssetSymbolRenderer assetString={pair.longAsset} />
              </>
            )
          }
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.fundingRate)}
          value={
            <>
              <span className="tw-text-sm tw-text-trade-short tw-font-medium">
                {data?.fundingRate4h && numberToPercent(data.fundingRate4h, 4)}
              </span>{' '}
              {t(translations.perpetualPage.contractDetails.fundingRate4hr)}
            </>
          }
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.contractValue)}
          value={
            data?.contractValue && (
              <>
                {toNumberFormat(data.contractValue, 2)}{' '}
                <AssetSymbolRenderer assetString={pair.longAsset} />
              </>
            )
          }
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.lotSize)}
          value={data?.lotSize && toNumberFormat(data.lotSize, 0)}
        />
        <ContractDetailEntry
          title={t(translations.perpetualPage.contractDetails.minTradeAmount)}
          value={
            data?.minTradeAmount && (
              <>
                {toNumberFormat(data.minTradeAmount, 2)}{' '}
                <AssetSymbolRenderer assetString={pair.longAsset} />
              </>
            )
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
