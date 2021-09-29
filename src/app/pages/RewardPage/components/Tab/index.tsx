import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';

interface ITabProps {
  text: string;
  amountToClaim?: string;
  active?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  asset?: Asset;
}

export const Tab: React.FC<ITabProps> = ({
  text,
  amountToClaim,
  active,
  isDisabled,
  onClick,
  asset = Asset.SOV,
}) => (
  <button
    type="button"
    className={classNames(
      'btn',
      styles['tab-button'],
      active && styles['tab-button--active'],
    )}
    onClick={onClick}
    disabled={isDisabled}
  >
    <div className="tw-font-extralight">{text}</div>
    <div className="tw-text-2xl tw-font-semibold">
      {bignumber(amountToClaim).greaterThan(0) ? (
        <Tooltip content={`${weiToNumberFormat(amountToClaim, 18)} ${asset}`}>
          <>
            {weiToNumberFormat(amountToClaim, 6)}
            <span className="tw--ml-0.5 tw-mr-2">...</span>
            <AssetRenderer asset={asset} assetClassName="tw-font-semibold" />
          </>
        </Tooltip>
      ) : (
        <>
          0 <AssetRenderer asset={asset} assetClassName="tw-font-semibold" />
        </>
      )}
    </div>
  </button>
);
