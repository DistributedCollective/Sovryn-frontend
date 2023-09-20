import React, { useMemo } from 'react';
import { IClaimFormProps } from '../BaseClaimForm/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Asset } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { weiToNumberFormat } from 'utils/display-text/format';
import { weiTo18 } from 'utils/blockchain/math-helpers';
import { Tooltip } from '@blueprintjs/core';
import { bignumber } from 'mathjs';
import classNames from 'classnames';
import { LoadableValue } from 'app/components/LoadableValue';

interface IFeesEarnedClaimRowProps extends IClaimFormProps {
  rbtcValue: number;
  contractAddress: string;
  asset: Asset;
  loading?: boolean;
  assetClaimLocked?: boolean;
}

export const FeesEarnedClaimRow: React.FC<IFeesEarnedClaimRowProps> = ({
  amountToClaim,
  asset,
  rbtcValue,
  loading,
  assetClaimLocked = false,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const claimFeesEarnedLocked = checkMaintenance(States.CLAIM_FEES_EARNED);

  const isClaimDisabled = useMemo(
    () =>
      claimFeesEarnedLocked ||
      !bignumber(amountToClaim).greaterThan(0) ||
      assetClaimLocked,
    [claimFeesEarnedLocked, amountToClaim, assetClaimLocked],
  );

  return (
    <tr
      className={classNames({
        'tw-opacity-50': isClaimDisabled,
      })}
    >
      <td>
        <AssetRenderer asset={asset} />
      </td>
      <td>
        <FeeValue value={amountToClaim} asset={asset} />
      </td>
      <td>
        {'≈ '}
        <LoadableValue
          value={<FeeValue value={rbtcValue} asset={Asset.RBTC} />}
          loading={loading}
        />
      </td>
      <td></td>
    </tr>
  );
};
interface IFeeValueProps {
  value: string | number;
  asset: Asset;
}
const FeeValue: React.FC<IFeeValueProps> = ({ value, asset }) => (
  <>
    {bignumber(value).greaterThan(0) ? (
      <Tooltip content={`${weiTo18(value)} ${asset}`}>
        {weiToNumberFormat(value, 6)}
      </Tooltip>
    ) : (
      <>0</>
    )}
  </>
);
