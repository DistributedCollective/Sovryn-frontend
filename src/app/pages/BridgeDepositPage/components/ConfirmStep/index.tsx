import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chain } from 'types';
import { selectBridgeDepositPage } from '../../selectors';
import { actions } from '../../slice';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { CrossBridgeAsset } from '../../types/cross-bridge-asset';
import { AssetModel } from '../../types/asset-model';
import { useWalletContext } from '@sovryn/react-wallet';
import { TxStep } from '../../types';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { NetworkModel } from '../../types/network-model';
import { SelectBox } from '../SelectBox';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Table } from '../../../BridgeWithdrawPage/components/styled';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { noop } from '../../../../constants';
import { ActionButton } from 'app/components/Form/ActionButton';
import { detectWeb3Wallet } from 'utils/helpers';
import { getWalletImage } from 'app/components/UserAssets/TxDialog/WalletLogo';

export const ConfirmStep: React.FC = () => {
  const { t } = useTranslation();
  const trans = translations.BridgeDepositPage.confirmStep;
  const dispatch = useDispatch();
  const { wallet } = useWalletContext();
  const walletName = detectWeb3Wallet();
  const { amount, chain, targetChain, sourceAsset, tx } = useSelector(
    selectBridgeDepositPage,
  );
  const network = useMemo(
    () =>
      BridgeDictionary.listNetworks().find(
        item => item.chain === chain,
      ) as NetworkModel,
    [chain],
  );
  const asset = useMemo(
    () =>
      BridgeDictionary.get(chain as Chain, targetChain)?.getAsset(
        sourceAsset as CrossBridgeAsset,
      ) as AssetModel,
    [chain, sourceAsset, targetChain],
  );
  const handleComplete = useCallback(() => {
    dispatch(actions.returnToPortfolio());
  }, [dispatch]);

  const renderInitialSteps = () => {
    return (
      <>
        {tx.step === TxStep.MAIN && (
          <>
            <div className="tw-mb-7 tw-text-base tw-text-center tw-font-semibold">
              {t(trans.pleaseWait)}
            </div>
            <p className="tw-w-80 tw-text-center tw-mt-12">
              {t(trans.preparingTransaction)}.
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
            <div className="tw-mb-8 tw-text-2xl tw-text-center tw-font-semibold">
              {tx.step === TxStep.PENDING_TRANSFER && (
                <> {t(trans.depositInProgress)}...</>
              )}
              {tx.step === TxStep.COMPLETED_TRANSFER && (
                <>{t(trans.depositComplete)}</>
              )}
              {tx.step === TxStep.FAILED_TRANSFER && (
                <>{t(trans.depositFailed)}</>
              )}
            </div>
            <div className="tw-mb-6 tw-text-center">
              {tx.step === TxStep.PENDING_TRANSFER && (
                <img
                  className="tw-h-14 tw-animate-spin"
                  src={iconPending}
                  title={t(translations.common.pending)}
                  alt={t(translations.common.pending)}
                />
              )}
              {tx.step === TxStep.COMPLETED_TRANSFER && (
                <img
                  className="tw-h-14"
                  src={iconSuccess}
                  title={t(translations.common.confirmed)}
                  alt={t(translations.common.confirmed)}
                />
              )}
              {tx.step === TxStep.FAILED_TRANSFER && (
                <img
                  className="tw-h-14"
                  src={iconRejected}
                  title={t(translations.common.failed)}
                  alt={t(translations.common.failed)}
                />
              )}
            </div>
            <Table>
              <tbody>
                <tr>
                  <td>
                    {t(translations.BridgeDepositPage.reviewStep.dateTime)}:
                  </td>
                  <td className="tw-text-right">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>{t(translations.BridgeDepositPage.reviewStep.from)}:</td>
                  <td className="tw-text-right">{network.name}</td>
                </tr>
                <tr>
                  <td>
                    {t(translations.BridgeDepositPage.reviewStep.amount)}:
                  </td>
                  <td className="tw-text-right">
                    {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}{' '}
                    {asset.symbol}
                  </td>
                </tr>
                <tr>
                  <td>{t(translations.BridgeDepositPage.reviewStep.tx)}:</td>
                  <td className="tw-text-right">
                    <LinkToExplorer
                      txHash={tx.hash}
                      chainId={network.chainId}
                      className="text-primary font-weight-normal text-nowrap tw-text-xs"
                    />
                  </td>
                </tr>
              </tbody>
            </Table>

            <ActionButton
              className="tw-mt-10 tw-w-40 tw-font-semibold tw-rounded-xl"
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
            {t(trans.rejectedByUser)}
          </p>

          <ActionButton
            className="tw-mt-10 tw-w-40 tw-font-semibold tw-rounded-xl"
            text={t(translations.common.close)}
            onClick={handleComplete}
          />
        </>
      )}
    </div>
  );
};
