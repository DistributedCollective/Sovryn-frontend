import React, { useMemo } from 'react';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { PieChart } from 'app/components/FinanceV2Components/PieChart';
import {
  getAssetSecondaryColor,
  getAssetColor,
} from 'app/components/FinanceV2Components/utils/getAssetColor';
import { getLendingContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Asset } from 'types';
import { LoadableValue } from 'app/components/LoadableValue';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

type Props = {
  asset: Asset;
};
const LeftSection: React.FC<Props> = ({ asset }) => {
  const { t } = useTranslation();
  const lendingContract = getLendingContractName(asset);
  const {
    value: marketLiquidity,
    loading: loadingMarketLiquidity,
  } = useCacheCallWithValue(lendingContract, 'marketLiquidity', '0');
  const {
    value: totalBorrow,
    loading: loadingTotalAssetBorrow,
  } = useCacheCallWithValue(lendingContract, 'totalAssetBorrow', '0');

  const totalMarketLiquidity = useMemo(
    () => parseFloat(weiTo18(marketLiquidity)),
    [marketLiquidity],
  );

  const totalAssetBorrow = useMemo(() => parseFloat(weiTo18(totalBorrow)), [
    totalBorrow,
  ]);
  const firstPercentage = useMemo(
    () =>
      (totalMarketLiquidity * 100) / (totalAssetBorrow + totalMarketLiquidity),
    [totalAssetBorrow, totalMarketLiquidity],
  );
  const loading = loadingTotalAssetBorrow || loadingMarketLiquidity;

  const firstColor = getAssetColor(asset);
  const secondColor = getAssetSecondaryColor(asset);

  return (
    <div className="tw-flex tw-items-center tw-mr-4">
      {(loading || marketLiquidity) && (
        <PieChart
          firstAsset={asset}
          secondColor={secondColor}
          firstPercentage={loading ? 100 : firstPercentage}
          secondPercentage={loading ? 0 : 100 - firstPercentage}
        />
      )}
      <div
        style={{ minWidth: 105 }}
        className="tw-flex tw-items-center tw-ml-4"
      >
        <AssetRenderer asset={asset} showImage />
      </div>
      <div className="tw-flex tw-flex-col tw-gap-y-4">
        <div className="tw-flex tw-items-center">
          <span
            className="tw-rounded-full tw-w-3 tw-h-3 tw-mr-3"
            style={{ background: firstColor }}
          ></span>
          <div className="tw-flex tw-flex-col">
            {t(translations.lendingPage.poolChart.available)}
            <b style={{ width: 100 }}>
              <LoadableValue
                value={totalMarketLiquidity.toLocaleString('en', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                loading={loadingMarketLiquidity}
              />
            </b>
          </div>
        </div>
        <div className="tw-flex tw-items-center">
          <span
            className="tw-rounded-full tw-w-3 tw-h-3 tw-mr-3"
            style={{ background: secondColor }}
          ></span>
          <div className="tw-flex tw-flex-col">
            {t(translations.lendingPage.poolChart.borrowed)}
            <b style={{ width: 100 }}>
              <LoadableValue
                value={totalAssetBorrow.toLocaleString('en', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                loading={loadingTotalAssetBorrow}
              />
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
