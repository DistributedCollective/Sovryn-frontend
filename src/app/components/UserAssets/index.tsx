import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from '../../../locales/i18n';
import { ActionButton } from 'app/components/Form/ActionButton';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { AssetDetails } from '../../../utils/models/asset-details';
import { LoadableValue } from '../LoadableValue';
import { Asset } from '../../../types';
import { Skeleton } from '../PageSkeleton';
import {
  weiToNumberFormat,
  weiToUSD,
} from '../../../utils/display-text/format';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { FastBtcDialog, TransackDialog } from '../../containers/FastBtcDialog';
import {
  useAccount,
  useBlockSync,
  useIsConnected,
} from '../../hooks/useAccount';
import { AssetRenderer } from '../AssetRenderer/';
import { Sovryn } from '../../../utils/sovryn';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Dialog } from '../../containers/Dialog';
import { Button } from '../Button';
import { discordInvite } from 'utils/classifiers';
import { ConversionDialog } from './ConversionDialog';
import { BridgeLink } from './BridgeLink';
import { UnWrapDialog } from './UnWrapDialog';
import { useDollarValue } from '../../hooks/useDollarValue';

export function UserAssets() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.FASTBTC]: fastBtcLocked,
    [States.TRANSACK]: transackLocked,
  } = checkMaintenances();

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
  const [unwrapDialog, setUnwrapDialog] = useState(false);
  const [conversionToken, setConversionToken] = useState<Asset>(null!);

  const onConvertOpen = useCallback((asset: Asset) => {
    setConversionToken(asset);
    setConversionDialog(true);
  }, []);

  const onConvertClose = useCallback(() => {
    setConversionToken(null!);
    setConversionDialog(false);
  }, []);

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
                  onConvert={onConvertOpen}
                  onUnWrap={() => setUnwrapDialog(true)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <FastBtcDialog isOpen={fastBtc} onClose={() => setFastBtc(false)} />
      <TransackDialog isOpen={transack} onClose={() => setTransack(false)} />
      <ConversionDialog
        isOpen={conversionDialog}
        asset={conversionToken}
        onClose={onConvertClose}
      />
      <UnWrapDialog
        isOpen={unwrapDialog}
        onClose={() => setUnwrapDialog(false)}
      />
      <Dialog
        isOpen={
          (fastBtcLocked && (fastBtc || transack)) ||
          (transackLocked && transack)
        }
        onClose={() => {
          setFastBtc(false);
          setTransack(false);
        }}
      >
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.common.maintenance)}
          </h1>
          <div className="tw-text-sm tw-font-light tw-tracking-normal tw-text-center">
            <Trans
              i18nKey={
                fastBtc
                  ? translations.maintenance.fastBTC
                  : translations.maintenance.transack
              }
              components={[
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-underline hover:tw-no-underline"
                >
                  x
                </a>,
              ]}
            />
          </div>
          <div className="tw-text-center tw-mt-5">
            <Button
              text={t(translations.modal.close)}
              inverted
              onClick={() => {
                setFastBtc(false);
                setTransack(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
  onFastBtc: () => void;
  onTransack: () => void;
  onConvert: (asset: Asset) => void;
  onUnWrap: () => void;
}

function AssetRow({
  item,
  onFastBtc,
  onTransack,
  onConvert,
  onUnWrap,
}: AssetProps) {
  const { t } = useTranslation();
  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState('0');
  const blockSync = useBlockSync();

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      let tokenA: string = '0';
      if (item.asset === Asset.RBTC) {
        tokenA = await Sovryn.getWeb3().eth.getBalance(account);
      } else {
        tokenA = await contractReader
          .call<string>(getTokenContractName(item.asset), 'balanceOf', [
            account,
          ])
          .catch(e => {
            console.error('failed to load balance of ', item.asset, e);
            return '0';
          });
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

  const dollarValue = useDollarValue(item.asset, tokens);

  if (tokens === '0' && item.hideIfZero)
    return <React.Fragment key={item.asset} />;

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
          value={weiToUSD(dollarValue.value)}
          loading={dollarValue.loading}
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
          {[Asset.USDT, Asset.RDOC].includes(item.asset) && (
            <ActionButton
              text={t(translations.userAssets.actions.convert)}
              onClick={() => onConvert(item.asset)}
            />
          )}
          {[Asset.SOV, Asset.ETH, Asset.XUSD, Asset.BNB].includes(
            item.asset,
          ) && <BridgeLink asset={item.asset} />}
          {item.asset === Asset.WRBTC && (
            <ActionButton
              text={t(translations.userAssets.actions.unwrap)}
              onClick={onUnWrap}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
