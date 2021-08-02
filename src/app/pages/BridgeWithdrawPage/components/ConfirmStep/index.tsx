import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chain } from 'types';
import { selectBridgeWithdrawPage } from '../../selectors';
import { useWalletContext } from '@sovryn/react-wallet';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import wMetamask from 'assets/wallets/metamask.svg';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import styled from 'styled-components/macro';

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

export function ConfirmStep() {
  const { t } = useTranslation();
  const history = useHistory();
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
    history.push('/wallet');
  }, [history]);
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-80">
      {tx.step === TxStep.MAIN && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Please wait
          </div>
          <p className="tw-w-80 tw-text-center tw-mt-12">
            Preparing transaction.
          </p>
        </>
      )}
      {tx.step === TxStep.APPROVE && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Allow Transaction
          </div>
          <SelectBox onClick={noop}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-w-80 tw-mt-12 tw-text-center">
            Please approve {asset.fromWei(amount, asset.minDecimals)}{' '}
            {asset.symbol} to be spend by Sovryn smart-contracts in your{' '}
            {wallet.providerType} wallet.
          </p>
        </>
      )}
      {tx.step === TxStep.CONFIRM_TRANSFER && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Confirm Transaction
          </div>
          <SelectBox onClick={noop}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-w-80 tw-mt-12 tw-text-center">
            Please confirm the trade transaction in your {wallet.providerType}{' '}
            wallet.
          </p>
        </>
      )}
      {[
        TxStep.PENDING_TRANSFER,
        TxStep.COMPLETED_TRANSFER,
        TxStep.FAILED_TRANSFER,
      ].includes(tx.step) && (
        <>
          <div className="tw-mb-8 tw-text-2xl tw-text-center tw-font-semibold">
            {tx.step === TxStep.PENDING_TRANSFER && (
              <>Withdraw in Progress...</>
            )}
            {tx.step === TxStep.COMPLETED_TRANSFER && <>Withdraw Complete</>}
            {tx.step === TxStep.FAILED_TRANSFER && <>Withdraw Failed</>}
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
                <td>Date/Time:</td>
                <td>{new Date().toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>From:</td>
                <td>{currentNetwork.name}</td>
              </tr>
              <tr>
                <td>Amount:</td>
                <td>
                  {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}{' '}
                  {asset.symbol}
                </td>
              </tr>
              <tr>
                <td>To:</td>
                <td>{network.name}</td>
              </tr>
              <tr>
                <td>Tx:</td>
                <td>
                  <LinkToExplorer
                    txHash={tx.hash}
                    className="text-gold font-weight-normal text-nowrap tw-text-xs"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <ActionButton
            className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
            text="Close"
            onClick={handleComplete}
          />
        </>
      )}
      {tx.step === TxStep.USER_DENIED && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Transaction denied
          </div>
          <p className="tw-w-80 tw-mt-12 tw-text-center">Rejected by user</p>
          <ActionButton
            className="tw-mt-10 tw-w-80 tw-font-semibold tw-rounded-xl"
            text="Close"
            onClick={handleComplete}
          />
        </>
      )}
    </div>
  );
}

const Table = styled.table`
  td {
    padding: 0.5rem 1.25rem;
    text-align: left;
  }
`;
