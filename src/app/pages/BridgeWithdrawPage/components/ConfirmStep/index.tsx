import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chain } from 'types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { useWalletContext } from '@sovryn/react-wallet';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { getWalletImage } from 'app/components/UserAssets/TxDialog/WalletLogo';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Table } from '../styled';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { TxStep } from '../../../BridgeDepositPage/types';
import { BridgeDictionary } from '../../../BridgeDepositPage/dictionaries/bridge-dictionary';
import { NetworkModel } from '../../../BridgeDepositPage/types/network-model';
import { CrossBridgeAsset } from '../../../BridgeDepositPage/types/cross-bridge-asset';
import { AssetModel } from '../../../BridgeDepositPage/types/asset-model';
import { SelectBox } from '../../../BridgeDepositPage/components/SelectBox';
import { useHistory } from 'react-router-dom';
import { noop } from '../../../../constants';
import { ActionButton } from 'app/components/Form/ActionButton';
import { detectWeb3Wallet } from 'utils/helpers';

export const ConfirmStep: React.FC = () => {
  const { t } = useTranslation();
  const trans = translations.BridgeWithdrawPage.confirmStep;
  const history = useHistory();
  const walletName = detectWeb3Wallet();
  const { wallet } = useWalletContext();
  const { amount, chain, targetChain, sourceAsset, tx } = useSelector(
    selectBridgeWithdrawPage,
  );
  const currentNetwork = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === chain,
      ) as NetworkModel,
    [chain],
  );
  const network = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === targetChain,
      ) as NetworkModel,
    [targetChain],
  );
  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain as Chain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );
  const handleComplete = useCallback(() => {
    history.push('/portfolio');
  }, [history]);

  const renderInitialSteps = () => {
    return (
      <>
        {tx.step === TxStep.MAIN && (
          <>
            <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
              {t(trans.pleaseWait)}
            </div>
            <p className="tw-w-80 tw-text-center tw-mt-12">
              {t(trans.preparingTransaction)}
            </p>
          </>
        )}
        {tx.step === TxStep.APPROVE && (
          <>
            <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
              {t(trans.allowTransaction)}
            </div>
            <SelectBox onClick={noop}>
              <img
                className="tw-h-20"
                src={getWalletImage(walletName)}
                alt={walletName}
              />
            </SelectBox>
            <p className="tw-w-80 tw-mt-12 tw-text-center">
              {t(trans.approve, {
                from: asset.fromWei(amount, asset.minDecimals),
                symbol: asset.symbol,
                providerType: wallet.providerType,
              })}
            </p>
          </>
        )}
        {tx.step === TxStep.CONFIRM_TRANSFER && (
          <>
            <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
              {t(trans.confirmTransaction)}
            </div>
            <SelectBox onClick={noop}>
              <img
                className="tw-h-20"
                src={getWalletImage(walletName)}
                alt={walletName}
              />
            </SelectBox>
            <p className="tw-w-80 tw-mt-12 tw-text-center">
              {t(trans.confirm, { providerType: wallet.providerType })}
            </p>
          </>
        )}
      </>
    );
  };

  const renderTransferSteps = () => {
    return (
      <>
        {[
          TxStep.PENDING_TRANSFER,
          TxStep.COMPLETED_TRANSFER,
          TxStep.FAILED_TRANSFER,
        ].includes(tx.step) && (
          <>
            <div className="tw-mb-5 tw-text-base tw-text-center tw-font-semibold">
              {tx.step === TxStep.PENDING_TRANSFER && (
                <>{t(trans.withdrawInProgress)}...</>
              )}
              {tx.step === TxStep.COMPLETED_TRANSFER && (
                <>{t(trans.withdrawComplete)}</>
              )}
              {tx.step === TxStep.FAILED_TRANSFER && (
                <>{t(trans.withdrawFailed)}</>
              )}
            </div>
            <div className="tw-mb-6 tw-text-center">
              {tx.step === TxStep.PENDING_TRANSFER && (
                <img
                  className="tw-h-20 tw-animate-spin"
                  src={iconPending}
                  title={t(translations.common.pending)}
                  alt={t(translations.common.pending)}
                />
              )}
              {tx.step === TxStep.COMPLETED_TRANSFER && (
                <img
                  className="tw-h-20"
                  src={iconSuccess}
                  title={t(translations.common.confirmed)}
                  alt={t(translations.common.confirmed)}
                />
              )}
              {tx.step === TxStep.FAILED_TRANSFER && (
                <img
                  className="tw-h-20"
                  src={iconRejected}
                  title={t(translations.common.failed)}
                  alt={t(translations.common.failed)}
                />
              )}
            </div>
            <Table className="tw-mx-auto tw-text-left tw-text-sm tw-font-medium">
              <tbody>
                <tr>
                  <td>
                    {t(translations.BridgeWithdrawPage.reviewStep.dateTime)}:
                  </td>
                  <td className="tw-text-right">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    {t(translations.BridgeWithdrawPage.reviewStep.from)}:
                  </td>
                  <td className="tw-text-right">{currentNetwork.name}</td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    {t(translations.BridgeWithdrawPage.reviewStep.amount)}:
                  </td>
                  <td className="tw-text-right">
                    {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}{' '}
                    {asset.symbol}
                  </td>
                </tr>
                <tr>
                  <td> {t(translations.BridgeWithdrawPage.reviewStep.to)}:</td>
                  <td className="tw-text-right">{network.name}</td>
                </tr>
                <tr>
                  <td> {t(translations.BridgeWithdrawPage.reviewStep.tx)}:</td>
                  <td className="tw-text-right">
                    <LinkToExplorer
                      txHash={tx.hash}
                      className="text-primary font-weight-normal text-nowrap tw-text-xs"
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <ActionButton
              className="tw-mt-10 tw-w-44 tw-font-semibold tw-rounded-xl"
              text={t(translations.common.close)}
              onClick={handleComplete}
            />
          </>
        )}
      </>
    );
  };
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      {renderInitialSteps()}
      {renderTransferSteps()}
      {tx.step === TxStep.USER_DENIED && (
        <>
          <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
            {t(trans.transactionDenied)}
          </div>
          <p className="tw-w-80 tw-mt-12 tw-text-center">
            {' '}
            {t(trans.rejectedByUser)}
          </p>
          <ActionButton
            className="tw-mt-10 tw-w-44 tw-font-semibold tw-rounded-xl"
            text={t(translations.common.close)}
            onClick={handleComplete}
          />
        </>
      )}
    </div>
  );
};
