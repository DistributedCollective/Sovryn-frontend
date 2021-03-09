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

const bdnft = '0x65299adDc002Dd792797288ee6599772d20970Da'.toLowerCase();

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
    <div className="sovryn-border p-3 mb-5 pb-5">
      <p className="text-center sov-title mb-5">SOV Generation 01 NFT's</p>
      <div className="d-lg-flex text-center align-items-center justify-content-center">
        {account.toLowerCase() === bdnft && (
          <div className="mr-md-5 mb-sm-5 mb-5 ml-3 mr-3 position-relative d-inline-block">
            <div className="image-bordered">
              <img
                className="w-100 h-100 image-responsive"
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
                className="mr-md-5 mb-sm-5 mb-5 ml-3 mr-3 position-relative d-inline-block"
              >
                <div className="image-bordered">
                  <img
                    className="w-100 h-100 image-responsive"
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
        {/* <div className="mr-md-5 mb-sm-5 mb-5 ml-3 mr-3 position-relative d-inline-block">
          <div className="image-bordered">
            <img className="w-100 h-100 image-responsive" src={sov_2} alt="" />
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
