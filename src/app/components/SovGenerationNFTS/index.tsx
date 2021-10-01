/**
 *
 * SovGenerationNFTS
 *
 */

import React from 'react';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import bfntImg from 'assets/images/wallet/bnft.png';
import sov_icon from 'assets/images/wallet/icon-sov.svg';
import { useAccount } from '../../hooks/useAccount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { useLoadSovNfts } from './useLoadSovNfts';
import SovNftToken from './SovNftToken';

export function SovGenerationNFTS() {
  const account = useAccount();
  const { value: balanceCommunity } = useCacheCallWithValue(
    'SovrynNFTCommunity',
    'balanceOf',
    '0',
    account,
  );
  const { value: balanceHero } = useCacheCallWithValue(
    'SovrynNFTHero',
    'balanceOf',
    '0',
    account,
  );
  const { value: balanceSuperhero } = useCacheCallWithValue(
    'SovrynNFTSuperhero',
    'balanceOf',
    '0',
    account,
  );
  const { value: balanceBday } = useCacheCallWithValue(
    'SovrynNFTBday',
    'balanceOf',
    '0',
    account,
  );

  const tiers = [
    {
      title: 'Community',
      max: '0.03',
      balance: balanceCommunity,
      image: sov_1,
    },
    {
      title: 'Hero',
      max: '0.1',
      balance: balanceHero,
      image: sov_2,
    },
    {
      title: 'Superhero',
      max: '2',
      balance: balanceSuperhero,
      image: sov_3,
    },
  ];

  const { items } = useLoadSovNfts();

  return (
    <div className="sovryn-border tw-p-4 tw-mb-12 tw-pb-12">
      <p className="tw-text-center sov-title tw-mb-12">
        SOV Generation 01 NFT's
      </p>
      <div className="lg:tw-flex tw-text-center tw-items-center tw-justify-center">
        {items.map(item => (
          <SovNftToken key={item} tokenId={item} />
        ))}

        {balanceBday !== '0' && (
          <div className="md:tw-mr-5 sm:tw-mb-5 tw-mb-12 tw-ml-4 tw-mr-4 tw-relative tw-inline-block">
            <div className="image-bordered">
              <img
                className="tw-relative tw-w-full tw-max-w-xs tw-h-full tw-rounded-md"
                src={bfntImg}
                alt="Staying Sovryn for 10 halvings"
              />
            </div>
          </div>
        )}

        {tiers.map((item, index) => {
          return (
            item.balance !== '0' && (
              <div
                key={index}
                className="md:tw-mr-5 sm:tw-mb-5 tw-mb-12 tw-ml-4 tw-mr-4 tw-relative tw-inline-block"
              >
                <div className="image-bordered">
                  <img
                    className="tw-relative tw-w-full tw-max-w-xs tw-h-full tw-rounded-md"
                    src={item.image}
                    alt=""
                  />
                </div>
                <div className="sov-table">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <b>SOV Genesis Pre-Order</b>
                        </td>
                        <td rowSpan={2}>
                          <img src={sov_icon} alt="icon" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Purchase Limit: {item.max} BTC</b>
                        </td>
                      </tr>
                      <tr>
                        <td>{item.title} Tier</td>
                        <td>
                          <div>SOV-OG</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
