import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { Icon, Tooltip } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { AssetDetails } from 'utils/models/asset-details';
import { LoadableValue } from '../../LoadableValue';
import { Asset } from 'types';
import { weiToNumberFormat } from 'utils/display-text/format';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { AssetRenderer } from '../../AssetRenderer/';
import { Sovryn } from 'utils/sovryn';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Button, ButtonSize, ButtonStyle } from '../../Button';
import { BridgeLink } from './BridgeLink';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';
import { AssetValue } from 'app/components/AssetValue';

import busdIcon from 'app/pages/BridgeDepositPage/dictionaries/assets/icons/busd.svg';
import usdtIcon from 'app/pages/BridgeDepositPage/dictionaries/assets/icons/usdt.svg';
import usdcIcon from 'app/pages/BridgeDepositPage/dictionaries/assets/icons/usdc.svg';
import daiIcon from 'app/pages/BridgeDepositPage/dictionaries/assets/icons/dai.svg';
import { BABELFISH_APP_LINK } from 'utils/classifiers';

interface IUserAssetsTableRow {
  item: AssetDetails;
  onConvert: (asset: Asset) => void;
  onUnWrap: () => void;
}

const XUSD_ASSETS: {
  asset: CrossBridgeAsset;
  image: string;
}[] = [
  { asset: CrossBridgeAsset.DAI, image: daiIcon },
  { asset: CrossBridgeAsset.USDT, image: usdtIcon },
  { asset: CrossBridgeAsset.USDC, image: usdcIcon },
  { asset: CrossBridgeAsset.BUSD, image: busdIcon },
];

export const UserAssetsTableRow: React.FC<IUserAssetsTableRow> = ({
  item,
  onConvert,
  onUnWrap,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState('0');
  const blockSync = useBlockSync();

  const asset = useMemo(() => {
    return item.asset;
  }, [item.asset]);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcSendLocked = checkMaintenance(States.FASTBTC_SEND);
  const fastBtcReceiveLocked = checkMaintenance(States.FASTBTC_RECEIVE);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      let tokenA = '0';
      if (asset === Asset.RBTC) {
        tokenA = await Sovryn.getWeb3().eth.getBalance(account);
      } else {
        tokenA = await contractReader
          .call<string>(getTokenContractName(asset), 'balanceOf', [account])
          .catch(e => {
            console.error('failed to load balance of ', asset, e);
            return '0';
          });
      }

      let tokenB = '0';
      if (asset === Asset.CSOV) {
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
  }, [asset, account, blockSync]);

  const assetDollarValue = useDollarValue(asset, tokens);
  const hasAnyTokens = useMemo(() => tokens !== '0', [tokens]);
  if (!hasAnyTokens && item.hideIfZero) return <React.Fragment key={asset} />;

  return (
    <tr key={asset}>
      <td>
        <div className="tw-flex tw-flex-row tw-items-center">
          <div className="tw-inline-flex tw-items-center">
            <AssetRenderer asset={asset} showImage />
          </div>
          {asset === Asset.XUSD && (
            <div className="tw-inline-flex tw-flex-row tw-space-x-1 tw-ml-4 tw-items-center">
              {XUSD_ASSETS.map(xusdAsset => (
                <img
                  key={xusdAsset.asset}
                  src={xusdAsset.image}
                  className="tw-inline-block tw-h-6"
                  alt={xusdAsset.asset}
                  title={xusdAsset.asset}
                />
              ))}
              <a
                href="https://wiki.sovryn.app/en/technical-documents/xusd-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-white hover:tw-text-gray-9"
              >
                <Icon className="tw-cursor-pointer" icon="help" />
              </a>
            </div>
          )}
        </div>
      </td>
      <td className="tw-text-right">
        <LoadableValue value={weiToNumberFormat(tokens, 4)} loading={loading} />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        <LoadableValue
          value={
            <AssetValue value={assetDollarValue.value} assetString="USD" />
          }
          loading={assetDollarValue.loading}
        />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        <div className="tw-w-full tw-flex tw-flex-row tw-space-x-4 tw-justify-end">
          {asset === Asset.RBTC && (
            <>
              <Tooltip
                position="top"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={
                  <>
                    {fastBtcSendLocked
                      ? t(translations.maintenance.fastBTCPortfolio)
                      : t(translations.userAssets.sendMessage, { asset })}
                  </>
                }
                className="tw-flex tw-items-center"
              >
                {fastBtcSendLocked ? (
                  <div className="tw-cursor-not-allowed tw-opacity-25">
                    {t(translations.common.send)}
                  </div>
                ) : (
                  <Button
                    text={t(translations.common.send)}
                    href="/fast-btc/withdraw"
                    style={ButtonStyle.link}
                    size={ButtonSize.sm}
                    dataActionId={`portfolio-action-send-${asset}`}
                  />
                )}
              </Tooltip>

              <Tooltip
                position="top"
                hoverOpenDelay={0}
                hoverCloseDelay={0}
                interactionKind="hover"
                content={
                  <>
                    {fastBtcReceiveLocked
                      ? t(translations.maintenance.fastBTCPortfolio)
                      : t(translations.userAssets.receiveMessage, { asset })}
                  </>
                }
                className="tw-flex tw-items-center"
              >
                {fastBtcReceiveLocked ? (
                  <div className="tw-cursor-not-allowed tw-opacity-25">
                    {t(translations.common.receive)}
                  </div>
                ) : (
                  <Button
                    text={t(translations.common.receive)}
                    href="/rbtc"
                    style={ButtonStyle.link}
                    size={ButtonSize.sm}
                    dataActionId={`portfolio-action-receive-${asset}`}
                  />
                )}
              </Tooltip>
            </>
          )}
          {[Asset.USDT, Asset.RDOC].includes(asset) && (
            <Button
              text={t(translations.userAssets.actions.convert)}
              hrefExternal
              href={BABELFISH_APP_LINK}
              style={ButtonStyle.link}
              size={ButtonSize.sm}
              dataActionId={`portfolio-action-convert-${asset}`}
            />
          )}
          {[Asset.SOV, Asset.ETH, Asset.BNB].includes(asset) && (
            <BridgeLink asset={asset} disableWithdrawal={!hasAnyTokens} />
          )}
          {asset === Asset.WRBTC && (
            <Button
              text={t(translations.userAssets.actions.unwrap)}
              onClick={onUnWrap}
              style={ButtonStyle.link}
              size={ButtonSize.sm}
              disabled={!hasAnyTokens}
            />
          )}
          {asset === Asset.XUSD && (
            <>
              <Button
                text={t(translations.common.send)}
                hrefExternal
                href={BABELFISH_APP_LINK}
                style={ButtonStyle.link}
                size={ButtonSize.sm}
                dataActionId={`portfolio-action-send-xusd`}
              />

              <Button
                text={t(translations.common.receive)}
                hrefExternal
                href={BABELFISH_APP_LINK}
                style={ButtonStyle.link}
                size={ButtonSize.sm}
                dataActionId={`portfolio-action-receive-xusd`}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
