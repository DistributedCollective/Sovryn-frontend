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
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { LoadableValue } from '../LoadableValue';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { Asset } from '../../../types/asset';
import { usePriceFeeds_tradingPairRates } from '../../hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { Skeleton } from '../PageSkeleton';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { Sovryn } from '../../../utils/sovryn';

export function UserAssets() {
  const { t } = useTranslation();
  usePriceFeeds_tradingPairRates();
  const connected = useIsConnected();
  const account = useAccount();
  const assets = AssetsDictionary.list();

  return (
    <>
      <div className="sovryn-border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5">
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
  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState('0');
  const dollars = useCachedAssetPrice(item.asset, Asset.USDT);
  const history = useHistory();

  const [dollarValue, setDollarValue] = useState('0');

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      let tokenA: string = '0';
      if (item.asset === Asset.BTC) {
        tokenA = await Sovryn.getWeb3().eth.getBalance(account);
      } else {
        tokenA = await contractReader.call(
          getTokenContractName(item.asset),
          'balanceOf',
          [account],
        );
      }

      let tokenB: string = '0';
      if (item.asset === Asset.CSOV) {
        tokenB = await contractReader.call('CSOV2_token', 'balanceOf', [
          account,
        ]);
      }
      setTokens(
        bignumber(tokenA)
          .add(tokenB || '0')
          .toFixed(0),
      );
      setLoading(false);
    };
    get().catch();
  }, [item.asset, account]);

  useEffect(() => {
    if ([Asset.USDT, Asset.DOC].includes(item.asset)) {
      setDollarValue(tokens);
    } else {
      setDollarValue(
        bignumber(tokens)
          .mul(dollars.value)
          .div(10 ** item.decimals)
          .toFixed(0),
      );
    }
  }, [dollars.value, tokens, item.asset, item.decimals]);

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
        <LoadableValue value={weiToNumberFormat(tokens, 4)} loading={loading} />
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
          {item.asset !== Asset.CSOV ? (
            <>
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
            </>
          ) : (
            <Button
              minimal
              text={t(translations.userAssets.actions.claimSov)}
              disabled
              className="text-gold button-round"
            />
          )}
        </ButtonGroup>
      </td>
    </tr>
  );
}
