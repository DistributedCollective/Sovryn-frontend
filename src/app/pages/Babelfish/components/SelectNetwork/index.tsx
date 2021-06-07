import React from 'react';
import styled from 'styled-components/macro';
import bscIcon from 'assets/images/networks/bsc.svg';
import ethIcon from 'assets/images/networks/eth.svg';

type Props = {
  setNetwork: Function;
};
export function SelectNetwork({ setNetwork }: Props) {
  return (
    <div>
      <div className="tw-mb-20 tw-text-2xl tw-text-center">
        Select Network to deposit from
      </div>
      <div className="tw-flex tw-gap-10 tw-px-2">
        <Item
          onClick={() => setNetwork('ETH')}
          className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer tw-transition tw-duration-700 tw-ease-in-out"
        >
          <img className="tw-mb-3" src={ethIcon} alt="ETH" />
          ETH Network
        </Item>
        <Item
          onClick={() => setNetwork('BSC')}
          className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-cursor-pointer tw-transition tw-duration-700 tw-ease-in-out"
        >
          <img className="tw-mb-3" src={bscIcon} alt="BSC" />
          BSC Network
        </Item>
      </div>
    </div>
  );
}
const Item = styled.div`
  width: 160px;
  height: 160px;
  border: 1px solid #e9eae9;
  border-radius: 20px;
  &:hover {
    background: #575757 0% 0% no-repeat padding-box;
    border: 5px solid #e9eae9;
  }
`;
