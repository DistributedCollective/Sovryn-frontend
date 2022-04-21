/**
 *
 * SovGenerationNFTS
 *
 */

import React, { useMemo } from 'react';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import bfntImg from 'assets/images/wallet/bnft.png';
import sov_icon from 'assets/images/wallet/icon-sov.svg';
import { useAccount } from '../../hooks/useAccount';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { useLoadSovNfts } from './useLoadSovNfts';
import SovNftToken from './SovNftToken';
import { translations } from '../../../locales/i18n';
import { Trans, useTranslation } from 'react-i18next';
import { discordInvite } from '../../../utils/classifiers';

export function SovGenerationNFTS() {
  const { t } = useTranslation();
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

  const tiers = useMemo(
    () =>
      [
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
      ].filter(entry => entry.balance !== '0'),
    [balanceCommunity, balanceHero, balanceSuperhero],
  );

  const { items } = useLoadSovNfts();

  return (
    <div className="sovryn-border tw-p-4 tw-mb-12">
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

        {tiers.map((item, index) => (
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
                      <b>{t(translations.sovGenerationNFTS.genesisPreOrder)}</b>
                    </td>
                    <td rowSpan={2}>
                      <img src={sov_icon} alt="icon" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        {t(translations.sovGenerationNFTS.purchaseLimit)}{' '}
                        {item.max} BTC
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {item.title} {t(translations.sovGenerationNFTS.tier)}
                    </td>
                    <td>
                      <div>{t(translations.sovGenerationNFTS.tierSovOG)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {!items?.length && !tiers?.length && balanceBday === '0' && (
          <p className="tw-mt-4">
            <Trans
              i18nKey={translations.sovGenerationNFTS.emptyMessage}
              components={[
                <a className="tw-text-secondary" href={discordInvite}>
                  x
                </a>,
              ]}
            />
          </p>
        )}
      </div>
    </div>
  );
}
