import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSpotTradingPage } from '../../selectors';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import { Input } from 'app/components/Form/Input';
import { pairs, SpotPairType } from '../../types';
import cn from 'classnames';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { actions } from '../../slice';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import styles from './index.module.scss';
import { StarButton } from '../StarButton';
import { getFavoriteList, setFavoriteList } from './helpers';

const FAVORITE = 'FAVORITE';

const categories = [
  {
    label: 'ALL',
    value: '',
  },
  {
    label: 'SOV',
    value: 'SOV',
  },
  {
    label: 'RBTC',
    value: 'RBTC',
  },
  {
    label: 'XUSD',
    value: 'XUSD',
  },
  {
    label: 'FISH',
    value: 'FISH',
  },
];

interface IPairSelect {
  storageKey: string;
  pairList: SpotPairType[];
}

export const PairSelect: React.FC<IPairSelect> = ({ storageKey, pairList }) => {
  const ref = useRef(null);
  const { pairType } = useSelector(selectSpotTradingPage);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('SOV');

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="tw-relative tw-w-64">
      <div
        onClick={() => setOpen(!open)}
        className="tw-flex tw-items-center tw-py-3 tw-bg-gray-2 tw-px-8 tw-rounded-r-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75"
      >
        <div className="tw-flex-1">
          <Pair pairType={pairType} />
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
            'tw-absolute tw-transform tw-translate-y-full tw-bottom-0 tw-left-0 tw-bg-gray-2 tw-py-7 tw-px-9 tw-rounded-b-lg tw-z-50',
            styles.pairsModal,
          )}
        >
          <Input
            value={search}
            className={cn('tw-rounded-lg', styles.search)}
            inputClassName="tw-ml-0"
            onChange={setSearch}
            placeholder={'Search'}
            prependElem={
              <img className="tw-w-5" src={arrowDownIcon} alt="Arrow" />
            }
          />

          <div className="tw-flex tw-items-center tw-mt-3">
            <StarButton
              className="tw-mr-4"
              active={category === FAVORITE}
              onClick={() => setCategory(FAVORITE)}
            />
            {categories.map(item => (
              <div
                className={cn(
                  'tw-mr-5 tw-cursor-pointer tw-font-semibold tw-transition-opacity hover:tw-text-opacity-75 hover:tw-text-primary',
                  {
                    'tw-text-primary': category === item.value,
                    'tw-text-opacity-25': category !== item.value,
                  },
                )}
                key={item.value}
                onClick={() => setCategory(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="tw-mt-3">
            <PairsList
              category={category}
              search={search}
              closePairList={() => setOpen(false)}
              storageKey={storageKey}
              pairList={pairList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface IPairsList {
  category: string;
  search: string;
  closePairList: () => void;
  storageKey: string;
  pairList: string[];
}

export const PairsList: React.FC<IPairsList> = ({
  category,
  search,
  closePairList,
  storageKey,
  pairList,
}) => {
  const [favList, setFavList] = useState(getFavoriteList(storageKey));
  const dispatch = useDispatch();

  const list = useMemo(() => {
    return category === FAVORITE
      ? favList
      : pairList.filter(
          pair =>
            pair.includes(category) && pair.includes(search.toUpperCase()),
        );
  }, [category, favList, pairList, search]);

  useEffect(() => {
    setFavoriteList(storageKey, favList);
  }, [storageKey, favList]);

  const handleFavClick = useCallback(
    pair => {
      const index = favList.findIndex(item => item === pair);
      const list = [...favList];
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(pair);
      }
      setFavList(list);
    },
    [favList],
  );

  const selectPair = useCallback(
    pair => {
      dispatch(actions.setPairType(pair));
      closePairList();
    },
    [closePairList, dispatch],
  );

  return (
    <div className="tw-max-h-96 tw-overflow-auto tw-w-full">
      <table className="tw-w-full">
        <thead>
          <tr>
            <td className="tw-w-8"></td>
            <td>Pair</td>
            <td className="tw-text-right">Last traded price</td>
            <td className="tw-text-right">24H change</td>
          </tr>
        </thead>
        <tbody>
          {list.map(pair => (
            <tr
              key={pair}
              className="tw-text-sm tw-cursor-pointer tw-transition-opacity hover:tw-opacity-75"
            >
              <td>
                <StarButton
                  active={favList.includes(pair)}
                  onClick={() => handleFavClick(pair)}
                />
              </td>
              <td onClick={() => selectPair(pair)} className="tw-py-2">
                <Pair pairType={pair} />
              </td>
              <td onClick={() => selectPair(pair)} className="tw-text-right">
                0.0091898 / 10.00USD
              </td>
              <td
                onClick={() => selectPair(pair)}
                className="tw-text-right tw-text-trade-long"
              >
                +28.37%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface IPair {
  pairType: SpotPairType;
}

export const Pair: React.FC<IPair> = ({ pairType }) => {
  const pair = pairs[pairType];
  if (!pair) return null;

  return (
    <div className={'tw-flex tw-items-center tw-select-none'}>
      <div className="tw-rounded-full tw-z-10">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={AssetsDictionary.get(pair[0]).asset}
          src={AssetsDictionary.get(pair[0]).logoSvg}
        />
      </div>
      <div className="tw-rounded-full tw--ml-3">
        <img
          className="tw-w-8 tw-h-8 tw-object-scale-down"
          alt={AssetsDictionary.get(pair[1]).asset}
          src={AssetsDictionary.get(pair[1]).logoSvg}
        />
      </div>

      <div className="tw-font-light text-white tw-ml-2.5">
        <AssetSymbolRenderer asset={pair[0]} />
        /
        <AssetSymbolRenderer asset={pair[1]} />
      </div>
    </div>
  );
};
