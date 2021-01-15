/**
 *
 * UserAssets
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { bignumber } from 'mathjs';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { translations } from '../../../locales/i18n';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { AssetDetails } from '../../../utils/models/asset-details';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { LoadableValue } from '../LoadableValue';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { Asset } from '../../../types/asset';
import { usePriceFeeds_tradingPairRates } from '../../hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { Skeleton } from '../PageSkeleton';
import { numberToUSD } from '../../../utils/display-text/format';
// import { actions } from 'app/containers/FastBtcForm/slice';

export function UserAssets() {
  const { t } = useTranslation();
  usePriceFeeds_tradingPairRates();
  const connected = useIsConnected();
  const account = useAccount();
  const assets = AssetsDictionary.list();

  return (
    <>
      <div className="sovryn-border sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.totalBalance)}
              </th>
              <th className="text-right d-none d-md-table-cell">
                {t(translations.userAssets.tableHeaders.dollarBalance)}
              </th>
              <th className="text-right d-none d-md-table-cell">
                {t(translations.userAssets.tableHeaders.action)}
              </th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {!connected && (
              <>
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td className="d-none d-md-table-cell">
                    <Skeleton />
                  </td>
                  <td className="d-none d-md-table-cell">
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {connected &&
              account &&
              assets.map(item => <AssetRow key={item.asset} item={item} />)}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
}

function AssetRow({ item }: AssetProps) {
  const { t } = useTranslation();
  const tokens = useAssetBalanceOf(item.asset);
  const dollars = useCachedAssetPrice(item.asset, Asset.USDT);
  // const dispatch = useDispatch();
  const history = useHistory();

  const [dollarValue, setDollarValue] = useState('0');

  useEffect(() => {
    if ([Asset.USDT, Asset.DOC].includes(item.asset)) {
      setDollarValue(tokens.value);
    } else {
      setDollarValue(
        bignumber(tokens.value)
          .mul(dollars.value)
          .div(10 ** item.decimals)
          .toFixed(0),
      );
    }
  }, [dollars.value, tokens.value, item.asset, item.decimals]);

  return (
    <tr key={item.asset}>
      <td>
        <img
          className="d-inline mr-2"
          style={{ height: '40px' }}
          src={item.logoSvg}
          alt={item.asset}
        />{' '}
        {item.symbol}
      </td>
      <td className="text-right">
        <LoadableValue
          value={weiToFixed(tokens.value, 4)}
          loading={tokens.loading}
        />
      </td>
      <td className="text-right d-none d-md-table-cell">
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="text-right d-none d-md-table-cell">
        <ButtonGroup>
          {/*{item.asset === Asset.BTC && (*/}
          {/*  <Button*/}
          {/*    minimal*/}
          {/*    text={t(translations.userAssets.actions.deposit)}*/}
          {/*    className="text-gold"*/}
          {/*    onClick={() => dispatch(actions.showDialog(true))}*/}
          {/*  />*/}
          {/*)}*/}
          <Button
            minimal
            text={t(translations.userAssets.actions.trade)}
            className="text-gold button-round"
            onClick={() =>
              history.push('/', {
                params: { asset: item.asset, action: 'trade' },
              })
            }
          />
          <Button
            minimal
            text={t(translations.userAssets.actions.swap)}
            className="text-gold button-round"
            onClick={() =>
              history.push('/', {
                params: { asset: item.asset, action: 'swap' },
              })
            }
          />
        </ButtonGroup>
      </td>
    </tr>
  );
}
