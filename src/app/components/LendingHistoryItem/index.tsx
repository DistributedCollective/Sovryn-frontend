import React from 'react';
import { EventData } from 'web3-eth-contract';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { LinkToExplorer } from '../LinkToExplorer';

interface Props {
  item: EventData;
}

export function LendingHistoryItem({ item }: Props) {
  return (
    <div className="row mt-3 border-bottom">
      <div className="col-4">{item.event}</div>
      <div className="col-8">
        <LinkToExplorer txHash={item.transactionHash} />
      </div>
      <div className="col-4">Price: {weiTo4(item.returnValues.price)}</div>
      <div className="col-4">
        Asset Amount: {weiTo4(item.returnValues.assetAmount)}
      </div>
      <div className="col-4">
        Token Amount: {weiTo4(item.returnValues.tokenAmount)}
      </div>
    </div>
  );
}
