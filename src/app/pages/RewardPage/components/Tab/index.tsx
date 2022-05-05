import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { bignumber } from 'mathjs';
import { Tooltip } from '@blueprintjs/core';
import { LoadableValue } from 'app/components/LoadableValue';

interface ITabProps {
  text: string;
  amountToClaim?: string;
  active?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  asset?: Asset;
  loading?: boolean;
  showApproximateSign?: boolean;
  dataActionId?: string;
}

export const Tab: React.FC<ITabProps> = ({
  text,
  amountToClaim,
  active,
  isDisabled,
  onClick,
  asset = Asset.SOV,
  loading = false,
  showApproximateSign = false,
  dataActionId,
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
    data-action-id={dataActionId}
  >
    <div className="tw-font-light">{text}</div>
    <div className="tw-text-2xl tw-font-semibold">
      <LoadableValue
        value={
          bignumber(amountToClaim).greaterThan(0) ? (
            <Tooltip
              content={`${weiToNumberFormat(amountToClaim, 18)} ${asset}`}
            >
              <>
                {showApproximateSign && '≈ '}
                {weiToNumberFormat(amountToClaim, 6)}
                <span className="tw-mr-2">...</span>
                <AssetRenderer
                  asset={asset}
                  assetClassName="tw-font-semibold"
                />
              </>
            </Tooltip>
          ) : (
            <>
              0{' '}
              <AssetRenderer asset={asset} assetClassName="tw-font-semibold" />
            </>
          )
        }
        loading={loading}
      />
    </div>
  </button>
);
