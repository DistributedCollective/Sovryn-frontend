import React, { useMemo } from 'react';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../../components/AssetValue';
import { useTranslation } from 'react-i18next';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { OpenOrderEntry } from 'app/pages/PerpetualPage/hooks/usePerpetual_OpenOrders';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';

type OpenOrderRowProps = {
  item: OpenOrderEntry;
};

export const OpenOrderRow: React.FC<OpenOrderRowProps> = ({ item }) => {
  const { t } = useTranslation();

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const orderType = useMemo(() => {
    let res = [];
    res.push(
      item.triggerPrice > 0
        ? t('perpetualPage.openOrdersTable.orderTypes.stop')
        : t('perpetualPage.openOrdersTable.orderTypes.limit'),
    );

    res.push(
      (item?.positionSize || 0) > 0
        ? t('perpetualPage.openOrdersTable.orderTypes.buy')
        : t('perpetualPage.openOrdersTable.orderTypes.sell'),
    );
    res.push(t('perpetualPage.openOrdersTable.orderTypes.order'));

    return res.join(' ');
  }, [item, t]);

  if (pair === undefined) {
    return null;
  }

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={item.createdAt || Math.floor(Date.now() / 1e3).toString()}
        />
      </td>
      <td className={'tw-text-right'}>{pair.name}</td>
      <td
        className={classNames(
          'tw-text-right',
          item.positionSize || 1 > 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        {orderType}
      </td>
      <td className={'tw-text-right'}>{collateralName}</td>
      <td className="tw-text-right">
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.positionSize || 0}
          assetString={collateralName}
          mode={AssetValueMode.auto}
        />
      </td>
      <td className="tw-text-left">
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.limitPrice || 0}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>

      <td className="tw-text-left">
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.triggerPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>
    </tr>
  );
};
