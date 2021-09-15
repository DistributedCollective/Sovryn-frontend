import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { usePerpetual_ContractDetails } from '../../hooks/usePerpetual_ContractDetails';

type IContractDetailsProps = {
  pair: PerpetualPair;
};

export const ContractDetails: React.FC<IContractDetailsProps> = ({ pair }) => {
  const { t } = useTranslation();
  const data = usePerpetual_ContractDetails(pair);

  return (
    <div className="tw-w-full tw-bg-black tw-py-2">
      <div className="tw-container tw-flex tw-flex-row tw-flex-wrap tw-justify-between tw-items-center ">
        <h3 className="tw-mr-2.5 tw-text-sm tw-font-semibold tw-normal-case">
          {t(translations.perpetualPage.contractDetails.title)}
        </h3>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs tw-font-medium">
            {t(translations.perpetualPage.contractDetails.indexPrice)}
          </span>
          <span className="tw-text-sm tw-text-primary tw-font-semibold">
            {data?.indexPrice?.toFixed(2)}
          </span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.volume24h)}
          </span>
          <span className="tw-text-sm tw-font-medium">{data?.volume24h}</span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.openInterest)}
          </span>
          <span className="tw-text-sm tw-font-medium">
            {data?.openInterest}
          </span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.fundingRate)}
          </span>
          <span className="tw-text-sm tw-text-trade-short tw-font-medium">
            {data?.fundingRate4h && (data.fundingRate4h * 100).toFixed(4) + '%'}
          </span>{' '}
          <span className="tw-text-sm tw-font-medium">
            {t(translations.perpetualPage.contractDetails.fundingRate4hr)}
          </span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.contractValue)}
          </span>
          <span className="tw-text-sm tw-font-medium">
            {data?.contractValue}
          </span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.lotSize)}
          </span>
          <span className="tw-text-sm tw-font-medium">{data?.lotSize}</span>
        </div>
        <div className="tw-mr-4">
          <span className="tw-mr-2.5 tw-text-xs">
            {t(translations.perpetualPage.contractDetails.minTradeAmount)}
          </span>
          <span className="tw-text-sm tw-font-medium">
            {data?.minTradeAmount}
          </span>
        </div>
      </div>
    </div>
  );
};
