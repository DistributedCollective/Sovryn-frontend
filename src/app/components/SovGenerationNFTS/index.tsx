import React, { useMemo } from 'react';
import sov_1 from 'assets/images/wallet/sov_1.jpg';
import sov_2 from 'assets/images/wallet/sov_2.jpg';
import sov_3 from 'assets/images/wallet/sov_3.jpg';
import bfntImg from 'assets/images/wallet/bnft.png';
import sov_icon from 'assets/images/wallet/icon-sov.svg';
import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { useLoadSovNfts } from './useLoadSovNfts';
import SovNftToken from './SovNftToken';
import { Picture } from '../Picture';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export const SovGenerationNFTS: React.FC = () => {
  const account = useAccount();
  const { t } = useTranslation();
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

  const isEmpty = useMemo(() => {
    return (
      balanceCommunity === '0' &&
      balanceHero === '0' &&
      balanceSuperhero === '0' &&
      balanceBday === '0'
    );
  }, [balanceHero, balanceSuperhero, balanceBday, balanceCommunity]);

  const tiers = [
    {
      title: t(translations.userAssets.gallery.community),
      max: '0.03',
      balance: balanceCommunity,
      image: sov_1,
    },
    {
      title: t(translations.userAssets.gallery.hero),
      max: '0.1',
      balance: balanceHero,
      image: sov_2,
    },
    {
      title: t(translations.userAssets.gallery.superhero),
      max: '2',
      balance: balanceSuperhero,
      image: sov_3,
    },
  ];

  const { items } = useLoadSovNfts();

  return (
    <div className="sovryn-border tw-p-4 tw-mb-12 tw-pb-12">
      <p className="tw-text-center sov-title tw-mb-12">
        {t(translations.userAssets.gallery.title)}
      </p>
      <div className="lg:tw-flex tw-text-center tw-items-center tw-justify-center">
        {items.map(item => (
          <SovNftToken key={item} tokenId={item} />
        ))}

        {balanceBday !== '0' && (
          <div className="md:tw-mr-5 sm:tw-mb-5 tw-mb-12 tw-ml-4 tw-mr-4 tw-relative tw-inline-block">
            <div className="image-bordered">
              <Picture
                className="tw-relative tw-w-full tw-max-w-xs tw-h-full tw-rounded-md"
                src={bfntImg}
              />
            </div>
          </div>
        )}

        {isEmpty && (
          <p className="tw-text-lg">
            {t(translations.userAssets.gallery.emptyGallery)}
          </p>
        )}

        {tiers.map((item, index) => {
          return (
            item.balance !== '0' && (
              <div
                key={index}
                className="md:tw-mr-5 sm:tw-mb-5 tw-mb-12 tw-ml-4 tw-mr-4 tw-relative tw-inline-block"
              >
                <div className="image-bordered">
                  <Picture
                    className="tw-relative tw-w-full tw-max-w-xs tw-h-full tw-rounded-md"
                    src={item.image}
                  />
                </div>
                <div className="sov-table">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <b>{t(translations.userAssets.gallery.preOrder)}</b>
                        </td>
                        <td rowSpan={2}>
                          <Picture src={sov_icon} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>
                            {t(translations.userAssets.gallery.purchaseLimit)}{' '}
                            {item.max} {t(translations.userAssets.gallery.btc)}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {item.title} {t(translations.userAssets.gallery.tier)}
                        </td>
                        <td>
                          <div>{t(translations.userAssets.gallery.sovOG)}</div>
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
};
