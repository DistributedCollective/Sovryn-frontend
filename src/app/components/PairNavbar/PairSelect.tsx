import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Input } from 'app/components/Form/Input';
import { IPairsData, TradingType } from 'types/trading-pairs';
import { selectSpotTradingPage } from 'app/pages/SpotTradingPage/selectors';
import { selectMarginTradePage } from 'app/pages/MarginTradePage/selectors';
import { Pair } from './Pair';
import { PairLabels } from './PairLabels';
import { StarButton } from 'app/components/StarButton';
import useOnClickOutside from 'app/hooks/useOnClickOutside';
import arrowDownIcon from 'assets/images/swap/ic_arrow_down.svg';
import searchIcon from 'assets/images/search.svg';
import { PairCryptocurrency } from './PairCryptocurrency';

const FAVORITE = 'FAVORITE';

interface IPairSelect {
  onPairChange: ([ITradingPairs]) => void;
  storageKey: string;
  pairsData: IPairsData;
  type: string;
}

export const PairSelect: React.FC<IPairSelect> = ({
  storageKey,
  onPairChange,
  pairsData,
  type,
}) => {
  const ref = useRef(null);
  const { pairType: pairSpotType } = useSelector(selectSpotTradingPage);
  const { pairType: pairMarginType } = useSelector(selectMarginTradePage);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="tw-relative tw-w-64 tw-self-stretch tw-mr-2">
      <div
        onClick={() => setOpen(!open)}
        className={classNames(
          { 'tw-rounded-b-lg': !open },
          'tw-flex tw-h-full tw-items-center tw-py-1 tw-bg-gray-2 tw-px-8 tw-rounded-t-lg tw-cursor-pointer tw-select-none tw-transition-opacity hover:tw-bg-opacity-75',
        )}
      >
        <div className="tw-flex-1">
          <Pair
            type={type}
            pairType={type === TradingType.SPOT ? pairSpotType : pairMarginType}
          />
        </div>
        <img
          className={classNames('tw-w-5 tw-transition-transform ', {
            'tw-transform tw-rotate-180': open,
          })}
          src={arrowDownIcon}
          alt="Arrow"
        />
      </div>
      {open && (
        <div className="tw-absolute tw-transform tw-translate-y-full tw-bottom-0 tw-left-0 tw-bg-gray-2 tw-py-7 tw-px-9 tw-rounded-b-lg tw-z-10">
          <Input
            value={search}
            className="tw-rounded-lg search tw-max-w-full"
            inputClassName="tw-ml-0"
            onChange={setSearch}
            placeholder={'Search'}
            prependElem={
              <img className="tw-w-5" src={searchIcon} alt="Search" />
            }
            data-action-id="spot-select-searchbar"
          />

          <div className="tw-flex tw-items-center tw-mt-3">
            <StarButton
              className="tw-mr-4"
              active={category === FAVORITE}
              onClick={() => setCategory(FAVORITE)}
            />
            {pairsData && (
              <PairLabels
                pairs={pairsData.pairs}
                onChangeCategory={e => setCategory(e)}
                category={category}
                type={type}
              />
            )}
          </div>
          {pairsData && (
            <div className="tw-mt-3">
              <PairCryptocurrency
                pairs={pairsData.pairs}
                storageKey={storageKey}
                category={category}
                search={search}
                closePairList={() => setOpen(false)}
                onPairChange={onPairChange}
                type={type}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
