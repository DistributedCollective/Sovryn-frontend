/**
 *
 * StatsRow
 *
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Asset } from 'types/asset';

interface Props {
  asset: Asset;
  contract: any;
}

export function StatsRow(props: Props) {
  const [data, setData] = useState();
  useEffect(() => {
    setData(data);
  }, [data]);

  const supplyAPR = 1;
  const TVL = 1;
  const totalUSD = 1;
  const totalAsset = 1;
  const totalBorrowed = 1;
  const totalAvailable = 1;
  const borrowAPR = 1;
  return (
    <tr>
      <td>{props.asset}</td>
      <td>{TVL}</td>
      <td>{totalUSD}</td>
      <td>{totalAsset}</td>
      <td>{totalBorrowed}</td>
      <td>{totalAvailable}</td>
      <td>{supplyAPR}</td>
      <td>{borrowAPR}</td>
    </tr>
  );
}

const Div = styled.div``;
