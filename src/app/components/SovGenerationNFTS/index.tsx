/**
 *
 * SovGenerationNFTS
 *
 */

import React from 'react';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import sov_icon from 'assets/images/wallet/icon-sov.svg';
import { useAccount } from '../../hooks/useAccount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

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

  return (
    <div className="sovryn-border tw-p-3 tw-mb-5 pb-5">
      <p className="tw-text-center sov-title tw-mb-5">
        SOV Generation 01 NFT's
      </p>
      <div className="lg:tw-flex tw-text-center tw-items-center tw-justify-center">
        {tiers.map((item, index) => {
          return (
            item.balance !== '0' && (
              <div
                key={index}
                className="mr-md-5 mb-sm-5 tw-mb-5 tw-ml-3 tw-mr-3 tw-relative tw-inline-block"
              >
                <div className="image-bordered">
                  <img
                    className="tw-w-full tw-h-full image-responsive"
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
        {/* <div className="mr-md-5 mb-sm-5 tw-mb-5 tw-ml-3 tw-mr-3 tw-relative tw-inline-block">
          <div className="image-bordered">
            <img className="tw-w-full tw-h-full image-responsive" src={sov_2} alt="" />
          </div>
          <div className="sov-table">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <b>SOVRYN whitelist</b>
                  </td>
                  <td rowSpan={2}>
                    <img src={sov_icon} alt="" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Exclusive Access</b>
                  </td>
                </tr>
                <tr>
                  <td>SOVRYN OG</td>
                  <td>
                    <div>SOV-OG</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>*/}
      </div>
    </div>
  );
}
