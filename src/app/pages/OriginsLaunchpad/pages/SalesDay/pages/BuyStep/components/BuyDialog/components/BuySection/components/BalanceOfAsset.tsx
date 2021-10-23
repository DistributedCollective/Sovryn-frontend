import React from 'react';
import cn from 'classnames';
// import internal types & utils
import { Asset } from 'types/asset';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { weiToNumberFormat } from 'utils/display-text/format';
// import components
import { AssetRenderer } from 'app/components/AssetRenderer';

interface BalanceOfAssetProps {
  asset: Asset;
  className?: string;
}

export const BalanceOfAsset: React.FC<BalanceOfAssetProps> = ({
  asset,
  className,
}) => {
  const balance = useAssetBalanceOf(asset);

  return (
    <div className={cn('tw-flex', 'tw-justify-end', className)}>
      <div className="tw-text-sm tw-inline-block tw-border tw-rounded-lg tw-border-gray-7 tw-py-2 tw-px-4">
        <span className="tw-pr-1">Balance :</span>
        <span className="tw-pr-1">{weiToNumberFormat(balance?.value, 4)}</span>
        <AssetRenderer asset={asset} />
      </div>
    </div>
  );
};
