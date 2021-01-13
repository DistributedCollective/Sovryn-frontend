/**
 *
 * SovGenerationNFTS
 *
 */

import React, { useEffect, useState } from 'react';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import sov_icon from 'assets/images/wallet/icon-sov.svg';
import { weiToNumberFormat } from 'utils/display-text/format';
import { trimZero } from 'utils/blockchain/math-helpers';
import { useAccount } from '../../hooks/useAccount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';

export function SovGenerationNFTS() {
  const account = useAccount();
  const { value: maxPurchase } = useCacheCallWithValue(
    'CrowdSale',
    'getMaxPurchase',
    '0',
    account,
  );

  const tier = trimZero(weiToNumberFormat(maxPurchase, 8));
  const [tierLabel, setTierLabel] = useState('');
  const [tierImage, setTierImage] = useState('');

  useEffect(() => {
    switch (tier) {
      case '0.03':
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
      case '0.1':
        setTierLabel('Hero');
        setTierImage(sov_2);
        break;
      case '2':
        setTierLabel('Superhero');
        setTierImage(sov_3);
        break;
      default:
        setTierLabel('Community');
        setTierImage(sov_1);
        break;
    }
  }, [tier, setTierLabel, setTierImage]);

  return (
    <div className="sovryn-border p-3 mb-5 pb-5">
      <p className="text-center sov-title mb-5">SOV Generation 01 NFT's</p>
      <div className="d-md-flex text-center align-items-center justify-content-center">
        <div className="mr-md-5 mb-md-0 mb-sm-5 mb-5 ml-3 mr-3 position-relative d-inline-block">
          <div className="image-bordered">
            <img
              className="w-100 h-100 image-responsive"
              src={tierImage}
              alt=""
            />
          </div>
          <div className="sov-table">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <b>SOV Genesis Sale</b>
                  </td>
                  <td rowSpan={2}>
                    <img src={sov_icon} alt="icon" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Purchase Limit: {tier} BTC</b>
                  </td>
                </tr>
                <tr>
                  <td>{tierLabel} Tier</td>
                  <td>
                    <div>SOV-OG</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="ml-3 mr-3 position-relative d-inline-block">
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
        </div>
      </div>
    </div>
  );
}
