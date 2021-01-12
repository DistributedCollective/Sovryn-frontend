/**
 *
 * TopUpHistory
 *
 */
import React from 'react';
import sov_1 from '../../../assets/images/wallet/sov_1.jpg';
import sov_2 from '../../../assets/images/wallet/sov_2.jpg';
import sov_icon from '../../../assets/images/wallet/icon-sov.svg';

export function SovGenerationNFTS() {
  return (
    <div className="sovryn-border p-3 mb-5 pb-5">
      <p className="text-center">Sov Generation 01 NFT's</p>
      <div className="d-md-flex align-items-center justify-content-center">
        <div className="mr-md-3 mb-md-0 mb-sm-3 mb-3 position-relative">
          <img className="w-100 h-100" src={sov_1} alt="" />
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
                  <td>Purchase Limit: 0.03 BTC</td>
                </tr>
                <tr>
                  <td>Community Tier</td>
                  <td>
                    <span>SOV-OG</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="ml-md-3 position-relative">
          <img className="w-100 h-100" src={sov_2} alt="" />
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
                  <td>Exclusive Access</td>
                </tr>
                <tr>
                  <td>SOVRYN OG</td>
                  <td>
                    <span>SOV-OG</span>
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
