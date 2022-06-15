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
import { Trans, useTranslation } from 'react-i18next';
import { discordInvite } from '../../../utils/classifiers';

export const SovGenerationNFTS: React.FC = () => {
  const account = useAccount();
  const { t } = useTranslation();
  const {
    value: balanceCommunity,
    loading: loadingCommunity,
  } = useCacheCallWithValue('SovrynNFTCommunity', 'balanceOf', '0', account);
  const { value: balanceHero, loading: loadingHero } = useCacheCallWithValue(
    'SovrynNFTHero',
    'balanceOf',
    '0',
    account,
  );
  const {
    value: balanceSuperhero,
    loading: loadingSuperhero,
  } = useCacheCallWithValue('SovrynNFTSuperhero', 'balanceOf', '0', account);
  const { value: balanceBday, loading: loadingBday } = useCacheCallWithValue(
    'SovrynNFTBday',
    'balanceOf',
    '0',
    account,
  );

  const tiers = useMemo(
    () =>
      [
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
      ].filter(entry => entry.balance !== '0'),
    [t, balanceCommunity, balanceHero, balanceSuperhero],
  );

  const { items, loading: loadingList } = useLoadSovNfts();

  const loading = useMemo(
    () =>
      loadingBday ||
      loadingCommunity ||
      loadingHero ||
      loadingSuperhero ||
      loadingList,
    [loadingBday, loadingCommunity, loadingHero, loadingList, loadingSuperhero],
  );

  return (
    <div className="sovryn-border tw-p-4 tw-mb-12">
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

        {loading && (
          <p className="tw-mt-4">
            {t(translations.userAssets.gallery.loadingMessage)}
          </p>
        )}
        {!loading && !items?.length && !tiers?.length && balanceBday === '0' && (
          <p className="tw-mt-4">
            <Trans
              i18nKey={translations.userAssets.gallery.emptyGallery}
              components={[
                <a className="tw-text-secondary" href={discordInvite}>
                  x
                </a>,
              ]}
            />
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
