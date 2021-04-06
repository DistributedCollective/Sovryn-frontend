import React from 'react';
import { symbolByTokenAddress } from 'utils/blockchain/contract-helpers';
import styled from 'styled-components';
import { EventTable } from './EventTable';

export interface Props {
  data: {
    asset: string;
    percentage: number | undefined;
    pool: string;
    txList: Array<any>;
    weightedAmount: number;
    weightedTotal: number | undefined;
  };
  isConnected: boolean;
}

export function PoolData(props: Props) {
  const sovReward = 25000;
  const yourSOV =
    props.data.percentage && (sovReward / 100) * props.data.percentage;

  return (
    <div className="col-12 col-md-6">
      <div className="row">
        <h2 className="w-100 text-center">
          <span className="text-secondary">Asset: </span>
          <span>{symbolByTokenAddress(props.data.asset)}</span>
        </h2>
      </div>
      <Div className="mt-3">
        <Label className="text-center">
          25k SOV
          <br />
          Reward
          <br />
          Pool
        </Label>
      </Div>
      <div className="row my-3">
        <div className="w-100 text-center font-family-montserrat">
          Your Current Share Of Reward Pool*:{' '}
          {props.data.percentage?.toFixed(2)}%
        </div>
        <div className="w-100 text-center font-family-montserrat">
          Your Current SOV Reward*: {yourSOV?.toFixed(2)}
        </div>
      </div>

      {props.isConnected && (
        <>
          <h3 className="w-100 text-center mt-5 mb-3">
            Your liquidity mining events
          </h3>
          {props.data.txList.length > 0 ? (
            <EventTable data={props.data.txList} />
          ) : (
            <div className="w-100 text-center mt-5">
              You have no {symbolByTokenAddress(props.data.asset)} liquidity
              mining events yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}

const Div = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 100%;
  border: 10px solid var(--secondary);
`;

const Label = styled.h3`
  margin-top: 15px;
`;
