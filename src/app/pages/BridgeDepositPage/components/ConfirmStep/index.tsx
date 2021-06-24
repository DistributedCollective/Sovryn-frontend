/**
 *
 * BridgeDepositPage
 *
 */

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
import { Button } from '../../../../components/Button';
import { SelectBox } from '../SelectBox';
import wMetamask from 'assets/wallets/metamask.svg';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import styled from 'styled-components/macro';

import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';

interface Props {}

export function ConfirmStep(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { wallet } = useWalletContext();
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
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-mw-320">
      {tx.step === TxStep.MAIN && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Please wait
          </div>
          <p className="tw-mw-320 tw-text-center tw-mt-12">
            Preparing transaction.
          </p>
        </>
      )}
      {tx.step === TxStep.APPROVE && (
        <>
          <div className="tw-mb-20 tw-text-2xl tw-text-center tw-font-semibold">
            Allow Transaction
          </div>
          <SelectBox onClick={() => {}}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-mt-12 tw-text-center">
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
          <SelectBox onClick={() => {}}>
            <img
              className="tw-h-20 tw-mb-5 tw-mt-2"
              src={wMetamask}
              alt={'Metamask'}
            />
            <div>Metamask</div>
          </SelectBox>
          <p className="tw-mw-320 tw-mt-12 tw-text-center">
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
            {tx.step === TxStep.PENDING_TRANSFER && <>Deposit in Progress...</>}
            {tx.step === TxStep.COMPLETED_TRANSFER && <>Deposit Complete</>}
            {tx.step === TxStep.FAILED_TRANSFER && <>Deposit Failed</>}
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
                <td>{network.name}</td>
              </tr>
              <tr>
                <td>Amount:</td>
                <td>
                  {toNumberFormat(asset.fromWei(amount), asset.minDecimals)}{' '}
                  {asset.symbol}
                </td>
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
          <Button
            className="tw-mt-10 tw-w-full"
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
          <p className="tw-mw-320 tw-mt-12 tw-text-center">Rejected by user</p>
          <Button
            className="tw-mt-10 tw-w-full"
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
