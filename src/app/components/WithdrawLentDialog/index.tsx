/**
 *
 * WithdrawLentDialog
 *
 */

import React, { useEffect, useState } from 'react';
import { Dialog, InputGroup } from '@blueprintjs/core';
import { SendTxResponseInterface } from 'app/hooks/useSendContractTx';
import { SendTxProgress } from '../SendTxProgress';
import { CloseModalButton } from '../CloseModalButton';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';
import { bignumber } from 'mathjs';
import { fromWei, toWei } from 'web3-utils';

interface Props {
  asset: Asset;
  isOpen: boolean;
  balance: string;
  amount: string;
  onChangeAmount: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  txState: Partial<SendTxResponseInterface> | null;
}

export function WithdrawLentDialog(props: Props) {
  const assetDetails = AssetsDictionary.get(props.asset);

  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setValid(
      bignumber(toWei(props.amount)).greaterThan(0) &&
        bignumber(toWei(props.amount)).lessThanOrEqualTo(props.balance),
    );
  }, [props.balance, props.amount]);

  return (
    <Dialog
      isOpen={props.isOpen}
      autoFocus={true}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      className="bg-secondary p-3 border border-Gold"
    >
      <div className="container position-relative p-3">
        <div className="" onClick={() => props.onClose()}>
          <CloseModalButton />
        </div>
        <div className="text-center">
          <img
            className="d-inline"
            src={assetDetails.logoSvg}
            alt={props.asset}
            style={{ height: '5rem' }}
          />
          <div className="text-Gold text-center mt-4 modal-title d-inline">
            Withdraw {props.asset}
          </div>
        </div>
        <div className="row p-3 mt-3">
          <div className="col-md-5 col-sm-12 data-label">
            Amount to withdraw
          </div>
          <div className="col-md-7 col-sm-12 data-container">
            <InputGroup
              className="d-inline-block"
              value={props.amount}
              onChange={e => props.onChangeAmount(e.currentTarget.value)}
            />
            <button
              className="btn btn-TabGrey text-white btn-sm pl-2"
              onClick={() => props.onChangeAmount(fromWei(props.balance))}
            >
              MAX
            </button>
          </div>
        </div>
        <div className="row px-3 pt-3 mb-2">
          <div className="col-md-5 col-sm-12 data-label">Currency</div>
          <div className="col-md-7 col-sm-12 data-container">{props.asset}</div>
        </div>
        <div className="position-relative h-100 w-100">
          <div className="text-center">
            <div className="py-3">
              <button
                className="btn btn-Gold rounded text-white my-5"
                onClick={() => props.onConfirm()}
                disabled={props.txState?.loading || !isValid}
              >
                Withdraw {props.asset}
              </button>
            </div>
          </div>
          <SendTxProgress
            status={props.txState?.status}
            txHash={props.txState?.txHash}
            loading={props.txState?.loading}
            displayAbsolute={true}
            type={'withdraw'}
          />
        </div>
      </div>
    </Dialog>
  );
}
