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
import { DepositStep, TxStep } from '../../types';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { NetworkModel } from '../../types/network-model';
import { Button } from '../../../../components/Button';

interface Props {}

export function ConfirmStep(props: Props) {
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
    dispatch(actions.setStep(DepositStep.COMPLETE));
  }, [dispatch]);
  return (
    <div>
      {tx.step === TxStep.MAIN && (
        <>
          <h1>Please wait</h1>
          <p>Preparing transaction.</p>
        </>
      )}
      {tx.step === TxStep.APPROVE && (
        <>
          <h1>Allow Transaction</h1>
          <p>
            Please approve {asset.fromWei(amount, asset.minDecimals)}{' '}
            {asset.symbol} to be spend by Sovryn smart-contracts in your{' '}
            {wallet.providerType} wallet.
          </p>
        </>
      )}
      {tx.step === TxStep.CONFIRM_TRANSFER && (
        <>
          <h1>Confirm Transaction</h1>
          <p>
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
          <h1>
            {tx.step === TxStep.PENDING_TRANSFER && <>Deposit in progress</>}
            {tx.step === TxStep.COMPLETED_TRANSFER && <>Deposit completed</>}
            {tx.step === TxStep.FAILED_TRANSFER && <>Deposit failed</>}
          </h1>
          <table>
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
                <td>From:</td>
                <td>{network.name}</td>
              </tr>
              <tr>
                <td>Tx:</td>
                <td>
                  <a
                    href={network.explorer + '/tx/' + tx.hash}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {tx.hash}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <Button text="Close" onClick={handleComplete} />
        </>
      )}
      {tx.step === TxStep.USER_DENIED && (
        <>
          <h1>Transaction denied</h1>
          <p>Rejected by user</p>
          <Button text="Close" onClick={handleComplete} />
        </>
      )}
    </div>
  );
}
