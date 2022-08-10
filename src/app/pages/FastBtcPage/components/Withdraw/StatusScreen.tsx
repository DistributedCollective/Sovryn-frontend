import React, { useCallback, useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { translations } from 'locales/i18n';
import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { SendTxResponse } from '../../../../hooks/useSendContractTx';
import { WalletTxHelper } from './WalletTxHelper';
import { TxStatus } from '../../../../../store/global/transactions-store/types';
import { FastBtcButton } from '../FastBtcButton';
import { LoadableValue } from '../../../../components/LoadableValue';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { bignumber } from 'mathjs';
import { LinkToExplorer } from '../../../../components/LinkToExplorer';
import { NetworkAwareComponentProps } from '../../types';
import { StatusComponent } from 'app/components/Dialogs/StatusComponent';
import { getBridgeChainId } from 'app/pages/BridgeDepositPage/utils/helpers';
import { getBTCAssetForNetwork } from '../../helpers';
import { Chain } from 'types';
import { AddressBadge } from 'app/components/AddressBadge';
import { ButtonColor, ButtonSize, Button } from 'app/components/Button';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

type StatusScreenProps = {
  tx: SendTxResponse;
} & NetworkAwareComponentProps;

export const StatusScreen: React.FC<StatusScreenProps> = ({ tx, network }) => {
  const { set, amount, address, aggregatorLimits } = useContext(
    WithdrawContext,
  );
  const { t } = useTranslation();
  const history = useHistory();

  const backToUrl = useMemo(
    () => (network === Chain.BSC ? '/perpetuals' : '/portfolio'),
    [network],
  );

  const backToTitle = useMemo(
    () =>
      network === Chain.BSC
        ? t(translations.fastBtcPage.backToPerpetuals)
        : t(translations.fastBtcPage.backToPortfolio),
    [network, t],
  );

  const weiAmount = useWeiAmount(amount);
  const { value: calculateCurrentFeeWei, loading } = useCacheCallWithValue(
    'fastBtcBridge',
    'calculateCurrentFeeWei',
    '0',
    weiAmount,
  );

  const feesPaid = useMemo(
    () =>
      bignumber(calculateCurrentFeeWei).add(aggregatorLimits.fee).toString(),
    [calculateCurrentFeeWei, aggregatorLimits.fee],
  );

  const receiveAmount = useMemo(
    () => bignumber(weiAmount).minus(feesPaid).toString(),
    [weiAmount, feesPaid],
  );

  const onGoBack = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.REVIEW })),
    [set],
  );

  const onGoToPortfolio = useCallback(() => history.replace(backToUrl), [
    backToUrl,
    history,
  ]);

  const expandedTxInfo = useMemo(
    () => [TxStatus.PENDING, TxStatus.CONFIRMED].includes(tx.status),
    [tx.status],
  );

  const chainId = getBridgeChainId(network);
  const asset = getBTCAssetForNetwork(network);

  const items = useMemo(
    () => [
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.dateTime),
        value: new Date().toLocaleDateString(),
      },
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.amount),
        value: (
          <AssetValue
            value={Number(amount)}
            minDecimals={2}
            maxDecimals={8}
            mode={AssetValueMode.auto}
            asset={asset}
          />
        ),
      },
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.address),
        value: (
          <AddressBadge realBtc txHash={address} className="tw-text-primary" />
        ),
      },
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.fees),
        value: (
          <LoadableValue
            value={
              <AssetValue
                value={feesPaid}
                minDecimals={2}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                assetString="BTC"
              />
            }
            loading={loading}
          />
        ),
      },
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.received),
        value: (
          <LoadableValue
            value={
              <AssetValue
                value={receiveAmount}
                minDecimals={2}
                maxDecimals={8}
                mode={AssetValueMode.auto}
                assetString="BTC"
              />
            }
            loading={loading}
          />
        ),
      },
      {
        label: t(translations.fastBtcPage.withdraw.reviewScreen.tx),
        value: (
          <LinkToExplorer
            chainId={chainId || undefined}
            txHash={tx.txHash}
            className="tw-text-primary tw-underline"
          />
        ),
      },
    ],
    [
      address,
      amount,
      asset,
      chainId,
      feesPaid,
      loading,
      receiveAmount,
      t,
      tx.txHash,
    ],
  );

  return (
    <>
      <div className="tw-mb-4 tw-text-base tw-text-center tw-font-semibold">
        <Trans
          i18nKey={
            translations.fastBtcPage.withdraw.statusScreen.titles[tx.status]
          }
          components={[<AssetSymbolRenderer asset={asset} />]}
        />
      </div>
      <div className="tw-w-full tw-max-w-80 tw-mb-10">
        {expandedTxInfo ? (
          <>
            <div className="tw-w-full">
              <StatusComponent status={tx.status} showLabel={false} />

              <table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium tw-w-full">
                <tbody>
                  {items.map(({ label, value }) => (
                    <tr>
                      <td className="tw-py-0.5">{label}:</td>
                      <td className="tw-py-0.5 tw-text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="tw-text-center tw-mb-8 tw-mt-4 tw-text-xs">
                <Trans
                  i18nKey={
                    translations.fastBtcPage.withdraw.reviewScreen.description
                  }
                  tOptions={{ hours: 1.5 }}
                  components={[
                    <a href="/" target="_blank" rel="noreferrer noopener">
                      ticket
                    </a>,
                  ]}
                />
              </div>

              <div className="tw-px-8 tw-text-center">
                <Button
                  className={
                    'tw-w-42 tw-font-semibold tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto'
                  }
                  size={ButtonSize.sm}
                  text={backToTitle}
                  onClick={onGoToPortfolio}
                  color={ButtonColor.primary}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="tw-full tw-flex tw-flex-col tw-justify-center tw-items-center">
              <WalletTxHelper tx={tx} />
              {tx.status === TxStatus.FAILED && (
                <div className="tw-px-8 tw-text-center">
                  <FastBtcButton
                    className="tw-absolute tw-right-0 tw-left-0 tw-bottom-8 tw-mx-auto"
                    text={t(translations.common.retry)}
                    onClick={onGoBack}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
