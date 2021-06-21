/**
 *
 * UserAssets
 *
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { bignumber } from 'mathjs';
import { translations } from '../../../locales/i18n';
import { ActionButton, ActionLink } from 'app/components/Form/ActionButton';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { AssetDetails } from '../../../utils/models/asset-details';
import { LoadableValue } from '../LoadableValue';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { Asset } from '../../../types';
import { Skeleton } from '../PageSkeleton';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { FastBtcDialog, TransackDialog } from '../../containers/FastBtcDialog';
import {
  useAccount,
  useBlockSync,
  useIsConnected,
} from '../../hooks/useAccount';
import { AssetRenderer } from '../AssetRenderer/';
import { currentNetwork } from '../../../utils/classifiers';
import { Sovryn } from '../../../utils/sovryn';
import { ConversionDialog } from './ConversionDialog';

export function UserAssets() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();
  const assets = useMemo(
    () =>
      AssetsDictionary.list().filter(
        item => ![Asset.CSOV].includes(item.asset),
      ),
    [],
  );

  const [fastBtc, setFastBtc] = useState(false);
  const [transack, setTransack] = useState(false);
  const [conversionDialog, setConversionDialog] = useState(false);

  return (
    <>
      <div className="sovryn-border sovryn-table tw-pt-1 tw-pb-4 tw-pr-4 tw-pl-4 tw-mb-12">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="tw-text-right">
                {t(translations.userAssets.tableHeaders.totalBalance)}
              </th>
              <th className="tw-text-right tw-hidden md:tw-table-cell">
                {t(translations.userAssets.tableHeaders.dollarBalance)}
              </th>
              <th className="tw-text-right tw-hidden md:tw-table-cell">
                {t(translations.userAssets.tableHeaders.action)}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {!connected && (
              <>
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td className="tw-hidden md:tw-table-cell">
                    <Skeleton />
                  </td>
                  <td className="tw-hidden md:tw-table-cell">
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {connected &&
              account &&
              assets.map(item => (
                <AssetRow
                  key={item.asset}
                  item={item}
                  onFastBtc={() => setFastBtc(true)}
                  onTransack={() => setTransack(true)}
                  onConvert={() => setConversionDialog(true)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <FastBtcDialog isOpen={fastBtc} onClose={() => setFastBtc(false)} />
      <TransackDialog isOpen={transack} onClose={() => setTransack(false)} />
      <ConversionDialog
        isOpen={conversionDialog}
        onClose={() => setConversionDialog(false)}
      />
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
  onFastBtc: () => void;
  onTransack: () => void;
  onConvert: () => void;
}

function AssetRow({ item, onFastBtc, onTransack, onConvert }: AssetProps) {
  const { t } = useTranslation();
  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState('0');
  const dollars = useCachedAssetPrice(item.asset, Asset.USDT);
  const history = useHistory();
  const blockSync = useBlockSync();

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      let tokenA: string = '0';
      if (item.asset === Asset.RBTC) {
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
  }, [item.asset, account, blockSync]);

  const dollarValue = useMemo(() => {
    if ([Asset.USDT, Asset.DOC].includes(item.asset)) {
      return tokens;
    } else {
      return bignumber(tokens)
        .mul(dollars.value)
        .div(10 ** item.decimals)
        .toFixed(0);
    }
  }, [dollars.value, tokens, item.asset, item.decimals]);

  return (
    <tr key={item.asset}>
      <td>
        <AssetRenderer asset={item.asset} showImage />
      </td>
      <td className="tw-text-right">
        <LoadableValue value={weiToNumberFormat(tokens, 4)} loading={loading} />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        <div className="tw-w-full tw-flex tw-flex-row tw-space-x-4 tw-justify-end">
          {item.asset === Asset.RBTC && (
            <ActionButton
              text={t(translations.userAssets.actions.buy)}
              onClick={() => onTransack()}
            />
          )}
          {item.asset === Asset.RBTC && (
            <ActionButton
              text={t(translations.userAssets.actions.fastBtc)}
              onClick={() => onFastBtc()}
            />
          )}
          {item.asset === Asset.USDT && (
            <ActionButton
              text={t(translations.userAssets.actions.convert)}
              onClick={onConvert}
            />
          )}
          {[Asset.ETH, Asset.XUSD, Asset.BNB].includes(item.asset) && (
            <ActionLink
              text={t(translations.userAssets.actions.deposit)}
              href={
                currentNetwork === 'mainnet'
                  ? 'https://bridge.sovryn.app'
                  : 'https://bridge.test.sovryn.app'
              }
              target="_blank"
              rel="noreferrer noopener"
            />
          )}
        </div>
      </td>
    </tr>
  );
}
