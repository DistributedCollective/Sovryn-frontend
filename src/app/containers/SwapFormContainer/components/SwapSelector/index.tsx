import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  IAssets,
  IAssetData,
  IPairs,
  IPairData,
} from 'app/pages/LandingPage/components/CryptocurrencyPrices/types';
import arrowUp from 'assets/images/trend-arrow-up.svg';
import arrowDown from 'assets/images/trend-arrow-down.svg';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Asset } from 'types';
import { AssetDetails } from 'utils/models/asset-details';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { numberToUSD, toNumberFormat } from 'utils/display-text/format';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import iconSearch from 'assets/images/swap/ic_search.svg';
import cn from 'classnames';
import styles from './index.module.scss';
import { Input } from 'app/components/Form/Input';
import { StarButton } from 'app/components/StarButton';
import { SwapSelectorLabels } from './SwapSelectorLabels';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { setFavoriteList } from 'utils/helpers';

const FAVORITE = 'FAVORITE';

interface ISwapSelectorProps {
  pairs: IPairs;
  assetData: IAssets;
  onChange: (value: Asset) => void;
  selectedAsset: Asset;
  selectedReverse: Asset;
  favList: string[];
  storageKey: string;
  onChangeFavorite: (value: string) => void;
}

export const SwapSelector: React.FC<ISwapSelectorProps> = ({
  pairs,
  assetData,
  onChange,
  selectedAsset,
  selectedReverse,
  favList,
  onChangeFavorite,
  storageKey,
}) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const list = useMemo(() => {
    if (!pairs) return [];
    return Object.keys(pairs)
      .map(key => pairs[key])
      .filter(pair => {
        return pair;
      });
  }, [pairs]);

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    setFavoriteList(storageKey, favList);
  }, [storageKey, favList]);

  if (!list.length) return null;
  return (
    <>
      <div ref={ref} className="tw-relative tw-w-full">
        <div
          onClick={() => setOpen(!open)}
          className="tw-flex tw-items-center tw-py-1 tw-bg-gray-3 tw-px-5 tw-rounded-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75"
        >
          <div className="tw-flex tw-flex-row tw-justify-start tw-items-center tw-flex-shrink-0 tw-flex-grow">
            <AssetRenderer imageSize={6} asset={selectedAsset} showImage />
          </div>
          <img
            className={cn('tw-w-5 tw-transition-transform ', {
              'tw-transform tw-rotate-180': open,
            })}
            src={arrowDownIcon}
            alt="Arrow"
          />
        </div>
        {open && (
          <div
            className={cn(
              'tw-absolute tw-transform tw-translate-y-full tw-bottom-0 tw-left-0 tw-bg-gray-2 tw-py-4 tw-px-8 tw-rounded-lg tw-z-10',
              styles.pairsModal,
            )}
          >
            <Input
              value={search}
              className={cn('tw-rounded-lg', styles.search)}
              inputClassName="tw-ml-0 tw-pl-2"
              onChange={setSearch}
              placeholder={'Search'}
              prependElem={
                <img className="tw-w-6" src={iconSearch} alt="Search" />
              }
            />
            <div className="tw-flex tw-items-center tw-my-3">
              <StarButton
                className="tw-mr-4"
                active={category === FAVORITE}
                onClick={() => setCategory(FAVORITE)}
              />
              {pairs && (
                <SwapSelectorLabels
                  pairs={pairs}
                  onChangeCategory={e => setCategory(e)}
                  category={category}
                />
              )}
            </div>
            <div className="tw-w-full">
              <table className="tw-w-full tw-text-md">
                <thead>
                  <tr>
                    <td className="tw-w-8"></td>
                    <td className="tw-pb-3">
                      {t(translations.spotTradingPage.pairNavbar.pair)}
                    </td>
                    <td className="tw-text-left tw-pb-3">
                      {t(
                        translations.spotTradingPage.pairNavbar.lastTradedPrice,
                      )}
                    </td>
                    <td className="tw-text-right tw-pl-5 tw-pb-3">
                      {t(translations.spotTradingPage.pairNavbar.dayChange)}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {list.map((pair: IPairData) => {
                    const assetDetailsRBTC = AssetsDictionary.getByTokenContractAddress(
                      pair.quote_id,
                    );
                    const assetDetails = AssetsDictionary.getByTokenContractAddress(
                      pair.base_id,
                    );
                    //as we don't have RBTC as source, we make a separate reverted pair from USDT_RBTC
                    let pairDivRBTC;
                    let pairDiv;

                    //show RBTC asset and make it searchable
                    if (
                      assetDetails.asset === Asset.USDT &&
                      Asset.RBTC.includes(search.toUpperCase())
                    )
                      pairDivRBTC = (
                        <SwapAsset
                          assetDetails={assetDetailsRBTC}
                          price24h={-pair.price_change_percent_24h}
                          lastPrice={1 / pair.last_price}
                          assetData={assetData && assetData[pair.quote_id]}
                          handleClick={e => onChange(e)}
                          isOpen={e => setOpen(e)}
                          selectedReverse={selectedReverse}
                          category={category}
                          favList={favList}
                          onChangeFavorite={e => onChangeFavorite(e)}
                        />
                      );

                    //show all other assets and make them searchable
                    if (assetDetails.asset.includes(search.toUpperCase()))
                      pairDiv = (
                        <SwapAsset
                          assetDetails={assetDetails}
                          price24h={pair.price_change_percent_24h_usd}
                          lastPrice={pair.last_price_usd}
                          assetData={assetData && assetData[pair.base_id]}
                          handleClick={e => onChange(e)}
                          isOpen={e => setOpen(e)}
                          selectedReverse={selectedReverse}
                          category={category}
                          favList={favList}
                          onChangeFavorite={e => onChangeFavorite(e)}
                        />
                      );

                    return (
                      <React.Fragment key={pair.base_id}>
                        {pairDivRBTC}
                        {pairDiv}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface ISwapAssetProps {
  assetData: IAssetData;
  assetDetails: AssetDetails;
  price24h: number;
  lastPrice: number;
  handleClick: (value: Asset) => void;
  isOpen: (value: boolean) => void;
  selectedReverse: Asset;
  category: string;
  favList: string[];
  onChangeFavorite: (value: string) => void;
}

export const SwapAsset: React.FC<ISwapAssetProps> = ({
  assetDetails,
  price24h,
  lastPrice,
  handleClick,
  isOpen,
  selectedReverse,
  category,
  favList,
  onChangeFavorite,
}) => {
  const setAssetToken = useCallback(() => {
    handleClick(assetDetails.asset);
    isOpen(false);
  }, [handleClick, isOpen, assetDetails.asset]);

  const isFavoriteActive = favList.some(
    (favorite: string) => favorite === assetDetails.asset,
  );

  return (
    <tr
      className={cn(
        'tw-text-xs tw-cursor-pointer tw-transition-opacity hover:tw-opacity-75',
        {
          'tw-pointer-events-none tw-cursor-not-allowed tw-opacity-25':
            selectedReverse === assetDetails.asset,
          'tw-hidden': category === FAVORITE && !isFavoriteActive,
        },
      )}
    >
      <td className="tw-pt-1 tw-pb-2">
        <StarButton
          active={isFavoriteActive}
          onClick={() => onChangeFavorite(assetDetails.asset)}
        />
      </td>
      <td
        className="tw-text-left tw-whitespace-nowrap tw-min-w-40 tw-mr-1 tw-pt-1 tw-pb-2"
        onClick={setAssetToken}
      >
        <img
          className="tw-inline"
          style={{ width: '30px' }}
          src={assetDetails.logoSvg}
          alt={assetDetails.symbol}
        />
        <strong className="tw-ml-2">
          <AssetSymbolRenderer asset={assetDetails.asset} />
        </strong>
      </td>

      <td
        className="tw-text-left tw-whitespace-nowrap tw-min-w-38 tw-mx-1 tw-pt-1 tw-pb-2"
        onClick={setAssetToken}
      >
        {numberToUSD(lastPrice || 0)}
      </td>

      <td
        className="tw-text-right tw-whitespace-nowrap tw-pt-1 tw-pb-2 tw-pl-5"
        onClick={setAssetToken}
      >
        <PriceChange value={price24h} />
      </td>
    </tr>
  );
};

interface IPriceChangeProps {
  value: number;
}

export const PriceChange: React.FC<IPriceChangeProps> = ({ value }) => {
  let numberString = toNumberFormat(value || 0, 2);
  numberString =
    numberString === '0.00' || numberString === '-0.00' ? '0' : numberString;
  const noChange = numberString === '0';

  return (
    <div
      className={cn('tw-inline-flex tw-items-center tw-ml-auto', {
        'tw-text-trade-short': value < 0 && !noChange,
        'tw-text-trade-long': value > 0 && !noChange,
      })}
    >
      {numberString}%
      {value > 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowUp} alt={'up'} />
      )}
      {value < 0 && !noChange && (
        <img className="tw-w-3 tw-ml-2" src={arrowDown} alt={'down'} />
      )}
    </div>
  );
};