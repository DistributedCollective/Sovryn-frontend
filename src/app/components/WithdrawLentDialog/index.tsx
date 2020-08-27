/**
 *
 * WithdrawLentDialog
 *
 */

import React, { useEffect, useState } from 'react';
import { Dialog, InputGroup, Tag } from '@blueprintjs/core';
import { SendTxResponseInterface } from 'app/hooks/useSendContractTx';
import { SendTxProgress } from '../SendTxProgress';
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
      className="bg-secondary py-3"
    >
      <div className="container">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img
            className="mb-3"
            src={assetDetails.logoSvg}
            alt={props.asset}
            style={{ height: '5rem' }}
          />
          <h2 className="mb-4">Withdraw</h2>
        </div>

        <InputGroup
          value={props.amount}
          onChange={e => props.onChangeAmount(e.currentTarget.value)}
          rightElement={<Tag>{props.asset}</Tag>}
        />

        <div className="d-flex justify-content-end mb-5 mt-3">
          <button
            className="btn btn-link btn-sm ml-3 mt-0"
            onClick={() => props.onChangeAmount(fromWei(props.balance))}
          >
            MAX
          </button>
        </div>

        <SendTxProgress
          status={props.txState?.status}
          txHash={props.txState?.txHash}
          loading={props.txState?.loading}
        />

        <div className="d-flex flex-row justify-content-end align-items-center">
          <button
            className="btn btn-link ml-3 mt-0"
            onClick={() => props.onClose()}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary ml-3 mt-0"
            onClick={() => props.onConfirm()}
            disabled={props.txState?.loading || !isValid}
          >
            Withdraw {props.asset}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
