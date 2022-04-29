import React, { useCallback, useMemo } from 'react';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../../components/AssetValue';
import { useTranslation } from 'react-i18next';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { OpenOrderEntry } from 'app/pages/PerpetualPage/hooks/usePerpetual_OpenOrders';
import {
  DisplayDate,
  SeparatorType,
} from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import {
  PerpetualTradeType,
  PERPETUAL_CHAIN_ID,
} from 'app/pages/PerpetualPage/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { prettyTx } from 'utils/helpers';
import { translations } from 'locales/i18n';
import { TableRowAction } from '../../TableRowAction';

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

  // TODO: Will be adjusted in https://sovryn.monday.com/boards/2218344956/pulses/2382474482
  const onCancelOrder = useCallback(() => console.log(item.id), [item.id]);

  const orderTypeTranslation = useMemo(() => {
    const tradeDirection = t(
      translations.perpetualPage.openOrdersTable.orderTypes[
        item?.orderSize > 0 ? 'buy' : 'sell'
      ],
    );

    if (item.orderType === PerpetualTradeType.STOP) {
      return `${t(
        translations.perpetualPage.openOrdersTable.orderTypes.stop,
      )} ${tradeDirection}`;
    }

    return `${t(
      translations.perpetualPage.openOrdersTable.orderTypes.limit,
    )} ${tradeDirection}`;
  }, [item, t]);

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={item.createdAt || Math.floor(Date.now() / 1e3).toString()}
          separator={SeparatorType.Dash}
        />
      </td>
      <td>{pair.name}</td>
      <td
        className={classNames({
          'tw-text-trade-long': item.orderSize > 0,
          'tw-text-trade-short': item.orderSize < 0,
        })}
      >
        {orderTypeTranslation}
      </td>
      <td>{collateralName}</td>
      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.orderSize}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={2}
          value={item.limitPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>

      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={2}
          value={item.triggerPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          minDecimals={0}
          maxDecimals={2}
          value={item.expiry}
          assetString={t(
            translations.perpetualPage.openOrdersTable.tableData[
              item.expiry <= 1 ? 'day' : 'days'
            ],
          )}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <LinkToExplorer
          className="tw-text-sov-white tw-underline"
          txHash={item.id}
          text={prettyTx(item.id)}
          chainId={PERPETUAL_CHAIN_ID}
        />
      </td>
      <td>
        <TableRowAction
          label={t(translations.perpetualPage.openOrdersTable.cancel)}
          tooltip={t(
            translations.perpetualPage.openOrdersTable.tooltips.cancel,
          )}
          onClick={onCancelOrder}
        />
      </td>
    </tr>
  );
};
