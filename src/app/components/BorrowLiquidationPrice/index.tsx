/**
 *
 * BorrowLiquidationPrice
 *
 */
import React from 'react';
import { Asset } from 'types/asset';
import { TradingPosition } from 'types/trading-position';
import { useBorrowAssetPrice } from 'app/hooks/trading/useBorrowAssetPrice';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useBorrowLiquidationPrice } from 'app/hooks/trading/useBorrowLiquidationPrice';
import { LoadableValue } from '../LoadableValue';
import { FieldGroup } from '../FieldGroup';
import { DummyField } from '../DummyField';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  asset: Asset;
  leverage: number;
  position: TradingPosition;
  labelColor: string;
}

export function BorrowLiquidationPrice(props: Props) {
  const { t } = useTranslation();
  const { value: price, loading: loadingPrice } = useBorrowAssetPrice(
    props.asset,
    Asset.DOC,
  );
  const { value, loading: loadingLiq } = useBorrowLiquidationPrice(
    props.asset,
    price,
    props.leverage,
    props.position,
  );
  return (
    <FieldGroup
      label={t(translations.global.liquidationPrice)}
      labelColor={props.labelColor}
    >
      <DummyField>
        <LoadableValue
          value={
            <>
              <span className="text-muted">$ </span>
              {weiToFixed(value, 2)}
            </>
          }
          loading={loadingPrice || loadingLiq}
        />
      </DummyField>
    </FieldGroup>
  );
}

BorrowLiquidationPrice.defaultProps = {
  labelColor: 'var(--dar-gray)',
};
